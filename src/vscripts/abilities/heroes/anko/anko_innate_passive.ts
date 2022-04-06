import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter";

@registerAbility()
export class anko_innate_passive extends BaseAbility
{
    OnUpgrade(): void {
        //Should refresh modifier on eanch upgrade
        this.GetCaster().FindModifierByName(this.GetIntrinsicModifierName())?.ForceRefresh()
    }

    GetIntrinsicModifierName(): string {
        return "modifier_anko_innate_passive"
    }

    Precache(context: CScriptPrecacheContext){
        PrecacheResource( "soundfile",   "soundevents/heroes/anko/anko_passive_trigger.vsndevts", context )
    }
}

@registerModifier()
export class modifier_anko_innate_passive extends BaseModifier {

    reset_interval?: number;
    total_damage_taken?: number;
    damage_threshold: number = 0;
    parent?: CDOTA_BaseNPC;
    spell_lifesteal?: number;
    damage: number = 0;
    


    IsHidden(): boolean {
        return false
    }

    IsDebuff(): boolean {
        return false
    }

    IsPurgable(): boolean {
        return false
    }

    AllowIllusionDuplicate(): boolean {
        return true
    }

    DeclareFunctions() {
        return [ModifierFunction.SPELL_LIFESTEAL_AMPLIFY_PERCENTAGE,
                ModifierFunction.ON_TAKEDAMAGE]
    }

    GetModifierSpellLifestealRegenAmplify_Percentage() {
        return this.spell_lifesteal
    }

    OnCreated(params: object): void {
        const ability = this.GetAbility()
        this.parent = this.GetParent()
        if(ability){
            this.reset_interval = ability.GetSpecialValueFor("damage_threshold_reset_time")
            this.spell_lifesteal = ability.GetSpecialValueFor("spell_lifesteal_base") + ability.GetSpecialValueFor("spell_lifesteal_per_level_bonus")*(ability.GetLevel()-1)
            this.damage_threshold = ability.GetSpecialValueFor("damage_threshold_base") + ability.GetSpecialValueFor("damage_threshold_per_level_bonus")*(ability.GetLevel()-1)
        }

        if(!IsServer()){ return }
        this.damage = 0;
    }

    OnRefresh(params: object): void {
        const ability = this.GetAbility()
        if(ability){
            this.reset_interval = ability.GetSpecialValueFor("damage_threshold_reset_time")
            this.spell_lifesteal = ability.GetSpecialValueFor("spell_lifesteal_base") + ability.GetSpecialValueFor("spell_lifesteal_per_level_bonus")*(ability.GetLevel()-1)
            this.damage_threshold = ability.GetSpecialValueFor("damage_threshold_base") + ability.GetSpecialValueFor("damage_threshold_per_level_bonus")*(ability.GetLevel()-1)
        }
    }

    CountDamageForPassivePruge(event: ModifierInstanceEvent): void{
        if(event.unit === this.parent) {
            if(this.parent.PassivesDisabled()) {return} //don't count if caster is broken
            if(!event.attacker.GetPlayerOwner()) {return} //don't count if damage suce is not player

            this.StartIntervalThink(this.reset_interval ? this.reset_interval : 0)
            this.damage += event.damage
            if(this.damage < this.damage_threshold){ return }
            this.damage = 0

            this.parent.Purge(
                false, //remove positive buffs
                true, //remove debuffs
                false, //frame only
                true, // removes stuns
                true //removes exceptions
            )
            //TODO: Play SFX\VFX
        }
    }

    ApplySpellLifeSteal(event: ModifierInstanceEvent): void {
        //Spell lifesteal bit
        if(event.damage_category !== DamageCategory.SPELL) {return}
        if(event.damage <= 0) {return}
        if(event.unit.GetTeam() === this.parent?.GetTeam()){ return}

        //splitting this in case we need different numbers for creeps in future
        if(event.unit.IsHero()){
            let amount_to_heal = event.damage * (this.spell_lifesteal ?? 0) * 0.01
            this.parent?.Heal(amount_to_heal, this.GetAbility())
        }else{
            let amount_to_heal = event.damage * (this.spell_lifesteal ?? 0) * 0.01
            this.parent?.Heal(amount_to_heal, this.GetAbility())
        }

        //Play spell lifesteal VFX
        const lifesteal_vfx =  ParticleManager.CreateParticle('particles/items3_fx/octarine_core_lifesteal.vpcf', ParticleAttachment.ABSORIGIN_FOLLOW, this.parent)
        ParticleManager.SetParticleControl(lifesteal_vfx, 0, event.attacker.GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(lifesteal_vfx);
    }

    OnTakeDamage(event: ModifierInstanceEvent): void {
        if(!IsServer()) {return} 
        this.CountDamageForPassivePruge(event)
        this.ApplySpellLifeSteal(event)
    }

    OnIntervalThink(): void {
        this.StartIntervalThink(-1)

        this.damage = 0
    }
}