import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class kisame_innate_passive extends BaseAbility
{
    OnUpgrade(): void {
        //Should refresh modifier on eanch upgrade
        this.GetCaster().FindModifierByName(this.GetIntrinsicModifierName())?.ForceRefresh()
    }

    GetIntrinsicModifierName(): string {
        return "modifier_kisame_innate_passive_intrinsic"
    }

    GetCooldown(level: number): number {
        let cooldown_base = this.GetSpecialValueFor("cooldown")
        // let cooldown_bonus_per_level = this.GetSpecialValueFor("cooldown_bonus_per_level")

        return cooldown_base
    }
}

@registerModifier()
export class modifier_kisame_innate_passive_intrinsic extends BaseModifier
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
        return [ModifierFunction.ON_ATTACK_LANDED]
    }

    OnAttackLanded(event: ModifierAttackEvent){
        let ability = this.GetAbility()
        if(!ability){return}
        
        if(!ability.IsCooldownReady()){return}
        if(event.attacker !== this.GetParent()){return}
        if(event.target.IsBuilding()){return}
        if(event.target.GetMana() <= 0){return}

        let max_mana_steal = (ability.GetSpecialValueFor("max_mana_stolen_percentage_base") + (ability.GetSpecialValueFor("max_mana_stolen_percentage_per_level") * this.GetParent().GetLevel() - 1)) * 0.01
        let mana_to_steal = event.target.GetMaxMana() * max_mana_steal
        let current_target_mana = event.target.GetMana()
        let mana_delta = current_target_mana - mana_to_steal

        let actual_stolen_mana = 0
        if(mana_delta <= 0){
            actual_stolen_mana = mana_to_steal + mana_delta
            event.target.SetMana(0)
        }else{
            actual_stolen_mana = mana_to_steal
            event.target.SetMana(mana_delta)
        }

        this.GetParent().SetMana(math.min(this.GetParent().GetMana() + actual_stolen_mana, this.GetParent().GetMaxMana()))
        
        // VFX/SFX
        let particle_cast = "particles/generic_gameplay/generic_manaburn.vpcf"
        let sound_cast = ""
    
        // Create Particle
        let effect_cast = ParticleManager.CreateParticle( particle_cast, ParticleAttachment.ABSORIGIN, event.target )
        ParticleManager.ReleaseParticleIndex( effect_cast )
    
        // Create Sound
        EmitSoundOn( sound_cast, event.target )

        let bonus_attack_duration = ability.GetSpecialValueFor("bonus_attack_damage_duration")
        let mana_percentage_as_bonus_damage = ability.GetSpecialValueFor("mana_percentage_as_bonus_damage")

        let bonus_attack_modifier = this.GetParent().AddNewModifier(this.GetParent(), this.GetAbility(), "modifier_kisame_innate_passive_attack_bonus", {duration: bonus_attack_duration})
        let bonus_damage = actual_stolen_mana * mana_percentage_as_bonus_damage * 0.01
        bonus_attack_modifier.SetStackCount(math.floor(bonus_damage))

        ability.StartCooldown(ability.GetEffectiveCooldown(ability.GetLevel()))
        
    }
}

@registerModifier()
export class modifier_kisame_innate_passive_attack_bonus extends BaseModifier
{
    IsDebuff(): boolean {
        return false
    }

    IsHidden(): boolean {
        return false
    }

    DeclareFunctions(){
        return [ModifierFunction.PREATTACK_BONUS_DAMAGE]
    }

    GetModifierPreAttack_BonusDamage(){
        return this.GetStackCount() ?? 0
    }
}