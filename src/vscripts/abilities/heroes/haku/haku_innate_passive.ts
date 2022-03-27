import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class haku_innate_passive extends BaseAbility
{
    OnUpgrade(): void {
        //Should refresh modifier on eanch upgrade
        this.GetCaster().FindModifierByName(this.GetIntrinsicModifierName())?.ForceRefresh()
    }

    GetIntrinsicModifierName(): string {
        return "modifier_haku_innate_passive_intrinsic"
    }

    Precache(context: CScriptPrecacheContext){
        PrecacheResource("particle", "particles/units/heroes/haku/haku_wounds_debuff.vpcf", context)
    }

    ApplyStacks(target: CDOTA_BaseNPC, stacks_count: number){
        if(target.IsBuilding()){return}
        if(this.GetCaster().PassivesDisabled()){return}

        if(!target.HasModifier("modifier_haku_innate_passive_victim_counter"))
        {
            target.AddNewModifier(this.GetCaster(),
                                  this,
                                  "modifier_haku_innate_passive_victim_counter",
                                  {duration: this.GetSpecialValueFor("duration")})
        }


        let counter_modifier = target.FindModifierByNameAndCaster("modifier_haku_innate_passive_victim_counter", this.GetCaster())
        let current_stacks_count = counter_modifier?.GetStackCount() ?? 0

        let new_stacks_count = current_stacks_count + stacks_count
        let max_stacks_count = this.GetSpecialValueFor("max_stacks_base") + this.GetSpecialValueFor("max_stacks_per_level_bonus")*(this.GetLevel()-1)
        let stacks_to_add = new_stacks_count > max_stacks_count ? math.max(max_stacks_count - current_stacks_count, 0) : stacks_count
        if(stacks_to_add>0){
            for(let i=0; i<stacks_to_add; i++){
                print("adding_modifier")
                target.AddNewModifier(this.GetCaster(),
                                        this,
                                        "modifier_haku_innate_passive_victim",
                                        {duration: this.GetSpecialValueFor("duration")})
            }
        }
        
    }
}

@registerModifier()
export class modifier_haku_innate_passive_intrinsic extends BaseModifier {
    caster?: CDOTA_BaseNPC;
    ability?: CDOTABaseAbility;
    stacks? : number;

    IsHidden(): boolean {
        return false
    }

    IsPassive(): boolean{
        return  true
    }

    DeclareFunctions() {
        return [ModifierFunction.ON_ATTACK_LANDED]
    }

    OnCreated(params: object): void {
        this.caster = this.GetCaster();
        this.ability = this.GetAbility();
        this.stacks = 0;
    }

    OnRefresh(params: object): void {
        this.caster = this.GetCaster();
        this.ability = this.GetAbility();
    }

    OnAttackLanded( event: ModifierAttackEvent){
        if(event.attacker == this.caster){
            let stacks_per_attack = this.ability?.GetSpecialValueFor("stacks_per_attack")
            
            if(!event.target.IsMagicImmune()){
                (this.ability as haku_innate_passive).ApplyStacks(event.target, stacks_per_attack ?? 0)
            }
        }
    }
}

@registerModifier()
class modifier_haku_innate_passive_victim_counter extends BaseModifier {
    current_stacks: number = 0;
    slow_per_stack: number = 0;
    duration: number = 0;
    dot_damage_table?: ApplyDamageOptions;
    slow_vfx?: ParticleID;

    IsHidden(): boolean {
        return false
    }

    IsPurgable(): boolean {
        return true
    }

    IsDebuff(): boolean {
        return true
    }

    OnCreated(params: object): void {
        this.current_stacks = 0
        this.slow_per_stack = (this.GetAbility()?.GetSpecialValueFor("ms_slow_per_stack") ?? 0)
        let talent_ability = this.GetCaster()?.FindAbilityByName("special_bonus_haku_1")
        if(talent_ability && talent_ability.GetLevel() > 0){
            this.slow_per_stack += talent_ability.GetSpecialValueFor("value")
        }
        this.duration = (this.GetAbility()?.GetSpecialValueFor("duration") ?? 0)

        if(!IsServer()){return}
        this.slow_vfx = ParticleManager.CreateParticle("particles/units/heroes/haku/haku_wounds_debuff.vpcf",
                                                ParticleAttachment.ABSORIGIN_FOLLOW,
                                                this.GetAbility()?.GetCaster())
        ParticleManager.SetParticleControlEnt(this.slow_vfx, 0, this.GetParent(), ParticleAttachment.POINT_FOLLOW, "origin", this.GetParent().GetOrigin(), true )
        let ability = this.GetAbility()
        if(ability){
            this.dot_damage_table = {
                victim: this.GetParent(),
                attacker: ability?.GetCaster(),
                damage_type: ability?.GetAbilityDamageType(),
                damage: 1,
                damage_flags: 0,
                ability: ability,
            }
        }

        this.StartIntervalThink(1)
    }

    OnIntervalThink(): void {
        let current_stacks = (this.GetStackCount() ?? 0)
        if(this.dot_damage_table){
            this.dot_damage_table.damage = current_stacks
            ApplyDamage(this.dot_damage_table)

            SendOverheadEventMessage(
                undefined,
                OverheadAlert.BONUS_SPELL_DAMAGE,
                this.GetParent(),
                current_stacks,
                this.GetCaster()?.GetPlayerOwner()
            )
        }
    }

    OnRemoved(): void {
        if(this.slow_vfx){
            ParticleManager.DestroyParticle(this.slow_vfx, false)
            ParticleManager.ReleaseParticleIndex(this.slow_vfx)
        }
    }

    OnDestroy(): void {
        
    }

    ChangeStacks(change: number){
        let current_stacks = this.GetStackCount()
        this.SetStackCount(current_stacks + change)
        this.current_stacks = current_stacks + change
        if(this.slow_vfx){
            ParticleManager.SetParticleControl(this.slow_vfx, 1, Vector(this.current_stacks, 0, 0))
        }

        if(current_stacks + change >= 0 && change > 0){
            this.SetDuration(this.duration, true)
        }
    }

    DeclareFunctions() {
        return [ModifierFunction.MOVESPEED_BONUS_PERCENTAGE]
    }

    GetModifierMoveSpeedBonus_Percentage(){
        return this.slow_per_stack * this.GetStackCount()
    }
}

@registerModifier()
class modifier_haku_innate_passive_victim extends BaseModifier{
    IsHidden(): boolean {
        return  true
    }

    IsPurgable(): boolean {
        return true
    }

    IsDebuff(): boolean {
        return true
    }

    GetAttributes(): ModifierAttribute {
        return ModifierAttribute.MULTIPLE
    }

    OnCreated(params: object): void {
        let target = this.GetParent()
        let caster = this.GetCaster()
        if(IsServer() && caster && target) {
            let counter = target.FindModifierByNameAndCaster("modifier_haku_innate_passive_victim_counter", caster)
            if(counter){
                (counter as modifier_haku_innate_passive_victim_counter).ChangeStacks(1)
            }
        }
    }

    OnRemoved(): void {
        let target = this.GetParent()
        let caster = this.GetCaster()
        if(IsServer() && caster && target) {
            let counter = target.FindModifierByNameAndCaster("modifier_haku_innate_passive_victim_counter", caster)
            if(counter){
                (counter as modifier_haku_innate_passive_victim_counter).ChangeStacks(-1)
            }
        }
    }

    OnDestroy(): void {
        
    }
}