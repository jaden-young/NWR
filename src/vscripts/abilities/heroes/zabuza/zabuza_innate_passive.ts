import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class zabuza_innate_passive extends BaseAbility
{
    OnUpgrade(): void {
        //Should refresh modifier on eanch upgrade
        let caster = this.GetCaster()
        caster.FindModifierByName(this.GetIntrinsicModifierName())?.ForceRefresh()
    }

    GetIntrinsicModifierName(): string {
        return "modifier_zabuza_innate_passive_instrinsic"
    }
}

@registerModifier()
export class modifier_zabuza_innate_passive_instrinsic extends BaseModifier
{
    bonus_damage_per_stack: number = 0
    bonus_attack_range_per_stack: number = 0

    IsPurgable(): boolean {
        return false
    }

    IsPermanent(): boolean {
        return true
    }

    IsDebuff(): boolean {
        return false
    }

    IsHidden(): boolean {
        return false
    }

    UpdateNumbers(){
        let ability = this.GetAbility()
        if(!ability){return}
        this.bonus_damage_per_stack = ability.GetSpecialValueFor("bonus_damage_per_stack")
        this.bonus_attack_range_per_stack = ability.GetSpecialValueFor("bonus_attack_range_per_stack")
    }

    OnCreated(params: object): void {
        this.UpdateNumbers()
    }

    OnRefresh(params: object): void {
        this.UpdateNumbers()
    }

    DeclareFunctions(){
        return [ModifierFunction.ON_DEATH,
                ModifierFunction.PREATTACK_BONUS_DAMAGE,
                ModifierFunction.ATTACK_RANGE_BONUS]
    }

    OnDeath(event: ModifierInstanceEvent){
        let ability = this.GetAbility()
        let parent = this.GetParent()
        if(!ability){return}
        if(event.attacker !== parent){return}
        if(parent.PassivesDisabled()){return}
        if(event.unit.GetTeam() === parent.GetTeam()){return}

        let max_stacks = ability.GetSpecialValueFor("max_stacks_base") + (ability.GetSpecialValueFor("max_stacks_per_level_bonus") * (ability.GetLevel() - 1))
        if(this.GetStackCount() < max_stacks){
            this.IncrementStackCount()
        }
    }

    GetModifierPreAttack_BonusDamage(){
        return this.bonus_damage_per_stack * this.GetStackCount()
    }

    GetModifierAttackRangeBonus(){
        return this.bonus_attack_range_per_stack * this.GetStackCount()
    }
}