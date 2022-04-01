import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class sasuke_innate_passive extends BaseAbility
{
    OnUpgrade(): void {
        //Should refresh modifier on eanch upgrade
        let caster = this.GetCaster()
        caster.FindModifierByName(this.GetIntrinsicModifierName())?.ForceRefresh()
    }

    GetIntrinsicModifierName(): string {
        return "modifier_sasuke_innate_passive_intrinsic"
    }
}

@registerModifier()
export class modifier_sasuke_innate_passive_intrinsic extends BaseModifier
{
    IsHidden(): boolean {
        return true
    }

    IsDebuff(): boolean {
        return false
    }

    IsPermanent(): boolean {
        return true
    }

    IsPurgable(): boolean {
        return false
    }

    DeclareFunctions(){
        return [ModifierFunction.ON_ABILITY_FULLY_CAST]
    }

    OnAbilityFullyCast(event: ModifierAbilityEvent){
        let parent = this.GetParent()
        let ability = this.GetAbility()
        if(!ability){return}
        if(event.unit !== parent){return}
        if(parent.PassivesDisabled()){return}

        if(!parent.HasModifier("modifier_sasuke_innate_passive_caster_buff")){
            parent.AddNewModifier(parent,ability,"modifier_sasuke_innate_passive_caster_buff", {})
        }
    }
}

@registerModifier()
export class modifier_sasuke_innate_passive_caster_buff extends BaseModifier{
    IsHidden(): boolean {
        return false
    }

    IsDebuff(): boolean {
        return false
    }

    IsPermanent(): boolean {
        return false
    }

    IsPurgable(): boolean {
        return true
    }

    DeclareFunctions(){
        return [ModifierFunction.ON_ATTACK_LANDED]
    }

    OnCreated(params: object): void {
        let parent = this.GetParent()
        let particle_cast = "particles/units/heroes/hero_stormspirit/stormspirit_overload_ambient.vpcf"
    
        let effect_cast = ParticleManager.CreateParticle( particle_cast, ParticleAttachment.ABSORIGIN_FOLLOW, parent )
        ParticleManager.SetParticleControlEnt(
            effect_cast,
            0,
            parent,
            ParticleAttachment.POINT_FOLLOW,
            "attach_attack1",
            Vector(0,0,0),
            true,
        )
    
        this.AddParticle(
            effect_cast,
            false, // bDestroyImmediately
            false, // bStatusEffect
            -1, // iPriority
            false, // bHeroEffect
            false // bOverheadEffect
        )
    }

    OnAttackLanded(event: ModifierAttackEvent){
        let ability = this.GetAbility()
        let parent = this.GetParent()
        if(!ability){return}
        if(event.attacker !== parent){return}
        if(event.target.IsBuilding()){return}
        if(event.target.GetTeam() === parent.GetTeam()){return}

        let debuff_duration = ability.GetSpecialValueFor("debuff_duration")
        let bonus_damage = ability.GetSpecialValueFor("bonus_damage_base") + (ability.GetSpecialValueFor("bonus_damage_per_level_bonus") * (ability.GetLevel() - 1))

        let damage_table = {
            victim: event.target,
            attacker: parent,
            damage: bonus_damage,
            damage_type: ability.GetAbilityDamageType(),
            damage_flags: DamageFlag.NONE,
            ability: ability
        } 

        ApplyDamage(damage_table)
        event.target.AddNewModifier(parent, ability, "modifier_sasuke_innate_passive_debuff", {duration: debuff_duration})

        let particle = ParticleManager.CreateParticle("particles/units/heroes/hero_stormspirit/stormspirit_overload_discharge.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, event.target) 
        ParticleManager.DestroyParticle(particle, false)
        ParticleManager.ReleaseParticleIndex(particle)
        
		event.target.EmitSound("sasuke_sword_impact")
        this.Destroy()
    }
}

@registerModifier()
export class modifier_sasuke_innate_passive_debuff extends BaseModifier
{
    movement_speed_slow_percentange: number = 0;
    attack_speed_slow: number = 0;

    IsHidden(): boolean {
        return false
    }

    IsDebuff(): boolean {
        return true
    }

    IsPermanent(): boolean {
        return false
    }

    IsPurgable(): boolean {
        return true
    }

    OnCreated(params: object): void {
        let ability = this.GetAbility()
        if(!ability){return}
        this.movement_speed_slow_percentange = ability.GetSpecialValueFor("movement_speed_slow_percentange")
        this.attack_speed_slow = ability.GetSpecialValueFor("attack_speed_slow")
    }

    DeclareFunctions(){
        return [ModifierFunction.MOVESPEED_BONUS_PERCENTAGE,
                ModifierFunction.ATTACKSPEED_BONUS_CONSTANT]
    }

    GetModifierMoveSpeedBonus_Percentage(){
        return this.movement_speed_slow_percentange * -1
    }

    GetModifierAttackSpeedBonus_Constant(){
        return this.attack_speed_slow * -1
    }
}