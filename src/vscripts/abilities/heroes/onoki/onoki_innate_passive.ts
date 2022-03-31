import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class onoki_innate_passive extends BaseAbility
{
    OnUpgrade(): void {
        //Should refresh modifier on eanch upgrade
        this.GetCaster().FindModifierByName(this.GetIntrinsicModifierName())?.ForceRefresh()
    }

    GetIntrinsicModifierName(): string {
        return "modifier_onoki_innate_passive_intrinsic"
    }

    Precache(context: CScriptPrecacheContext){
        PrecacheResource("particle", "particles/units/heroes/onoki/onoki_innate_passive_impact.vpcf", context)
        PrecacheResource("particle", "particles/units/heroes/onoki/onoki_innate_passive_debuff.vpcf", context)
    }
}

@registerModifier()
export class modifier_onoki_innate_passive_intrinsic extends BaseModifier
{
    attack_bonus_per_armor: number = 0
    armor_reduction_duration: number = 0

    IsDebuff(): boolean {
        return false
    }

    IsHidden(): boolean {
        return true
    }

    IsPermanent(): boolean {
        return true
    }

    IsPurgable(): boolean {
        return false
    }

    OnCreated(params: object): void {
        let ability = this.GetAbility()
        if(ability){
            this.attack_bonus_per_armor = ability.GetSpecialValueFor("attack_bonus_per_armor_multiplier")
            this.armor_reduction_duration = ability.GetSpecialValueFor("armor_reduction_duration")
        }
    }

    OnRefresh(params: object): void {
        let ability = this.GetAbility()
        if(ability){
            this.attack_bonus_per_armor = ability.GetSpecialValueFor("attack_bonus_per_armor_multiplier")
            this.armor_reduction_duration = ability.GetSpecialValueFor("armor_reduction_duration")
        }
    }

    DeclareFunctions(){
        return [ModifierFunction.ON_ATTACK_LANDED]
    }

    OnAttackLanded(event: ModifierAttackEvent){
        let ability = this.GetAbility()
        if(!ability){return}
        if(event.attacker !== this.GetParent()){return}
        if(event.target.IsBuilding()){return}
        if(!ability.IsCooldownReady()){return}

        let damage = this.attack_bonus_per_armor * this.GetParent().GetPhysicalArmorValue(false)
        print(this.armor_reduction_duration)
        let damage_options = {
            victim: event.target,
            attacker: this.GetParent(),
            damage: damage,
            damage_type: DamageTypes.PHYSICAL,
            damage_flags: DamageFlag.NONE
        }
        ApplyDamage(damage_options)

        let impact_vfx = ParticleManager.CreateParticle("particles/units/heroes/onoki/onoki_innate_passive_impact.vpcf", ParticleAttachment.ABSORIGIN, this.GetParent())
        ParticleManager.DestroyParticle(impact_vfx, false)
        ParticleManager.ReleaseParticleIndex(impact_vfx)
        
        SendOverheadEventMessage(
            undefined,
            OverheadAlert.BONUS_SPELL_DAMAGE,
            event.target,
            damage,
            this.GetCaster()?.GetPlayerOwner()
        )
        
        if(!IsServer()){return}
        let mod = event.target.AddNewModifier(this.GetParent(), ability, "modifier_onoki_innate_passive_victim", {duration: this.armor_reduction_duration})
        print(mod)

        ability.StartCooldown(ability.GetEffectiveCooldown(ability.GetLevel()))
    }
}

@registerModifier()
export class modifier_onoki_innate_passive_victim extends BaseModifier
{
    armor_reduction: number = 0

    IsDebuff(): boolean {
        return true
    }

    IsHidden(): boolean {
        return false
    }

    OnCreated(): void {
        let ability = this.GetAbility()
        if(ability){
            this.armor_reduction = ability.GetSpecialValueFor("armor_reduction_base") + (ability.GetSpecialValueFor("armor_reduction_per_level_bonus") * (ability.GetCaster().GetLevel() - 1))
        }
    }

    DeclareFunctions(){
        return [ModifierFunction.PHYSICAL_ARMOR_BONUS]
    }

    GetModifierPhysicalArmorBonus(){
        return -1 * this.armor_reduction
    }

    GetEffectName(): string {
        return "particles/units/heroes/onoki/onoki_innate_passive_debuff.vpcf"
    }

    GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.ABSORIGIN_FOLLOW
    }
}