import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class sakura_innate_passive extends BaseAbility
{
    OnUpgrade(): void {
        //Should refresh modifier on eanch upgrade
        let caster = this.GetCaster()
        caster.FindModifierByName(this.GetIntrinsicModifierName())?.ForceRefresh()
    }

    GetIntrinsicModifierName(): string {
        return "modifier_sakura_innate_passive_intrinsic"
    }
}

@registerModifier()
export class modifier_sakura_innate_passive_intrinsic extends BaseModifier
{
    IsHidden(): boolean {
        return false;
    }

    IsDebuff(): boolean {
        return false;
    }

    IsPurgable(): boolean {
        return false;
    }

    IsPermanent(): boolean {
        return false
    }

    DeclareFunctions(){
        return [ModifierFunction.ON_ATTACK_LANDED]
    }

    OnAttackLanded(event: ModifierAttackEvent){
        if(event.attacker !== this.GetParent()){return}
        if(event.target.IsBuilding()){return}
        if(this.GetParent().PassivesDisabled()){return}
        if(this.GetParent().GetTeam() === event.target.GetTeam()){return}

        let ability = this.GetAbility()
        if(!ability){return}
        let attacks_needed = ability.GetSpecialValueFor("attacks_needed")
        if(this.GetStackCount() === attacks_needed){
            let stun_duration = ability.GetSpecialValueFor("stun_duration_base") + (ability.GetSpecialValueFor("stun_duration_per_level_bonus") * (ability.GetLevel() - 1))
            event.target.AddNewModifier(this.GetParent(), ability, "modifier_sakura_innate_passive_stun", {duration: stun_duration})

            this.SetStackCount(0)

            let damage = ability.GetSpecialValueFor("damage_base") + (ability.GetSpecialValueFor("damage_per_level_bonus") * (ability.GetLevel() - 1))

            let damage_options = {
                victim: event.target,
                attacker: this.GetParent(),
                damage: damage,
                damage_type: DamageTypes.PHYSICAL,
                damage_flags: DamageFlag.NONE
            }
            ApplyDamage(damage_options)

            
            SendOverheadEventMessage(
                undefined,
                OverheadAlert.BONUS_SPELL_DAMAGE,
                event.target,
                damage,
                this.GetCaster()?.GetPlayerOwner()
            )

            event.target.EmitSound("sakura_strength_impact")

        }else{
            this.IncrementStackCount()
        }
    }
}

@registerModifier()
export class modifier_sakura_innate_passive_stun extends BaseModifier
{
    IsDebuff(): boolean {
        return true
    }

    IsStunDebuff(): boolean {
        return true
    }

    GetEffectName(): string {
        return "particles/generic_gameplay/generic_stunned.vpcf"
    }

    GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.OVERHEAD_FOLLOW
    }

    DeclareFunctions(){
        return [ModifierFunction.OVERRIDE_ANIMATION]
    }

    GetOverrideAnimation(){
        return GameActivity.DOTA_DISABLED
    }

    CheckState(){
        return {
            [ModifierState.STUNNED]: true
        }
    }
}