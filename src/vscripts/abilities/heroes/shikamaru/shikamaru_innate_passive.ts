import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class shikamaru_innate_passive extends BaseAbility
{
    OnUpgrade(): void {
        //Should refresh modifier on eanch upgrade
        let caster = this.GetCaster()
        caster.FindModifierByName(this.GetIntrinsicModifierName())?.ForceRefresh()
    }

    GetIntrinsicModifierName(): string {
        return "modifier_shikamaru_innate_passive_intrinsic"
    }

    ApplyDebuffStacks(target: CDOTA_BaseNPC, stacks_count: number){
        let debuff_duration = this.GetSpecialValueFor("debuff_duration")
        let debuff_modifier = target.AddNewModifier(this.GetCaster(), this, "modifier_shikamaru_innate_passive_debuff", {duration:debuff_duration})
        debuff_modifier.SetStackCount(stacks_count)
    }

    ResetStacks(){
        let caster = this.GetCaster()
        let stack_modifier = caster.FindModifierByName(this.GetIntrinsicModifierName())
        stack_modifier?.SetStackCount(0)
    }
}

@registerModifier()
export class modifier_shikamaru_innate_passive_intrinsic extends BaseModifier
{
    IsDebuff(): boolean {
        return false
    }

    IsPurgable(): boolean {
        return false
    }

    IsPermanent(): boolean {
        return true
    }

    IsHidden(): boolean {
        return false
    }

    OnCreated(params: object): void {
        let ability = this.GetAbility()
        if(!ability){return}
        let charge_rate_in_seconds = ability.GetSpecialValueFor("charge_rate_in_seconds")
        this.StartIntervalThink(charge_rate_in_seconds)
    }

    OnIntervalThink(): void {
        let ability = this.GetAbility()
        if(!ability){return}
        let max_stacks = ability.GetSpecialValueFor("max_stacks")
        if(this.GetStackCount() < max_stacks){
            this.IncrementStackCount()
        }
    }
}

@registerModifier()
export class modifier_shikamaru_innate_passive_debuff extends BaseModifier
{
    total_armor_reduction_per_stack_constant: number = 0
    magic_resistance_reduction_per_stack_percentage: number = 0

    IsDebuff(): boolean {
        return true
    }

    IsHidden(): boolean {
        return false
    }

    IsPurgable(): boolean {
        return true
    }

    OnCreated(params: object): void {
        let ability = this.GetAbility()
        if(!ability){return}
        this.total_armor_reduction_per_stack_constant = ability.GetSpecialValueFor("total_armor_reduction_per_stack_constant_base") + (ability.GetSpecialValueFor("total_armor_reduction_per_stack_constant_per_level_bonus") * (ability.GetLevel() - 1))
        this.magic_resistance_reduction_per_stack_percentage = ability.GetSpecialValueFor("magic_resistance_reduction_per_stack_percentage_base") + (ability.GetSpecialValueFor("magic_resistance_reduction_per_stack_percentage_per_level_bonus") * (ability.GetLevel() - 1))
    }

    DeclareFunctions(){
        return [ModifierFunction.PHYSICAL_ARMOR_BONUS ,
                ModifierFunction.MAGICAL_RESISTANCE_BONUS ]
    }

    GetModifierPhysicalArmorBonus(){
        return  -1 * (this.total_armor_reduction_per_stack_constant * this.GetStackCount())
    }

    GetModifierMagicalResistanceBonus(){
        return -1 * (this.magic_resistance_reduction_per_stack_percentage * this.GetStackCount())
    }
}