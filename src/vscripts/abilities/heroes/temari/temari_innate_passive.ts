import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class temari_innate_passive extends BaseAbility
{
    OnUpgrade(): void {
        //Should refresh modifier on eanch upgrade
        let caster = this.GetCaster()
        caster.FindModifierByName(this.GetIntrinsicModifierName())?.ForceRefresh()
    }

    GetIntrinsicModifierName(): string {
        return "modifier_temari_innate_passive_intrinsic"
    }
}

@registerModifier()
export class modifier_temari_innate_passive_intrinsic extends BaseModifier
{
    IsPurgable(): boolean {
        return false
    }

    IsHidden(): boolean {
        return true
    }

    IsDebuff(): boolean {
        return false
    }

    IsPermanent(): boolean {
        return true
    }

    DeclareFunctions(){
        return [ModifierFunction.ON_ABILITY_EXECUTED]
    }

    OnAbilityExecuted(event: ModifierAbilityEvent){
        let parent = this.GetParent()
        let ability = this.GetAbility()
        if(!ability){return}
        if(event.unit !== parent){return}
        if(parent.PassivesDisabled()){return}

        let stack_duration = ability.GetSpecialValueFor("stack_duration")
        parent.AddNewModifier(parent, this.GetAbility(), "modifier_temari_innate_passive_buff", {duration: stack_duration})
    }
}

@registerModifier()
export class modifier_temari_innate_passive_buff_counter extends BaseModifier
{
    bonus_attack_speed_constant: number = 0
    bonus_movement_speed_percentage: number = 0

    IsPurgable(): boolean {
        return true
    }

    IsHidden(): boolean {
        return false
    }

    IsDebuff(): boolean {
        return false
    }

    IsPermanent(): boolean {
        return false
    }

    UpdateNumbers(){
        let ability = this.GetAbility()
        if(!ability){return}
        this.bonus_attack_speed_constant = ability.GetSpecialValueFor("bonus_attack_speed_constant_per_stack_base") + (ability.GetSpecialValueFor("bonus_attack_speed_constant_per_stack_per_level_bonus") * (ability.GetLevel() - 1))
        this.bonus_movement_speed_percentage = ability.GetSpecialValueFor("bonus_movement_speed_percentage_per_stack_base") + (ability.GetSpecialValueFor("bonus_movement_speed_percentage_per_stack_per_level_bonus") * (ability.GetLevel() - 1))
    }

    OnCreated(): void {
        this.UpdateNumbers()
    }

    DeclareFunctions(){
        return [ModifierFunction.MOVESPEED_BONUS_PERCENTAGE,
                ModifierFunction.ATTACKSPEED_BONUS_CONSTANT]
    }

    GetModifierMoveSpeedBonus_Percentage(){
        return this.GetStackCount() *  this.bonus_movement_speed_percentage
    }

    GetModifierAttackSpeedBonus_Constant(){
        return this.GetStackCount() *  this.bonus_attack_speed_constant
    }
}

@registerModifier()
export class modifier_temari_innate_passive_buff extends BaseModifier
{
    IsPurgable(): boolean {
        return true
    }

    IsPermanent(): boolean {
        return false
    }

    IsDebuff(): boolean {
        return false
    }

    IsHidden(): boolean {
        return true
    }

    
    GetAttributes(): ModifierAttribute {
        return ModifierAttribute.MULTIPLE
    }

    OnCreated(params: object): void {
        let parent = this.GetParent()
        let ability = this.GetAbility()
        if(!IsServer()){return}
        if(!ability){return}
        let max_stacks = ability.GetSpecialValueFor("max_stacks")
        let stack_duration = ability.GetSpecialValueFor("stack_duration")
        if(parent.HasModifier("modifier_temari_innate_passive_buff_counter")){
            let counter_modifier = parent.FindModifierByName("modifier_temari_innate_passive_buff_counter")
            if(!counter_modifier){return}
            let current_stacks = counter_modifier.GetStackCount()
            if(current_stacks === max_stacks){
                let buff_modifiers = parent.FindAllModifiersByName("modifier_temari_innate_passive_buff")
                buff_modifiers[0].Destroy()
                counter_modifier.SetDuration(stack_duration, true)
                counter_modifier.IncrementStackCount()
            }else{
                counter_modifier.IncrementStackCount()
                counter_modifier.SetDuration(stack_duration, true)
            }
        }else{
            let new_counter_modifier = parent.AddNewModifier(parent, ability,"modifier_temari_innate_passive_buff_counter", {duration: stack_duration})
            new_counter_modifier.SetStackCount(1)
        }
    }

    OnDestroy(): void {
        if(!IsServer()){return}
        let parent = this.GetParent()
        let ability = this.GetAbility()
        if(!ability){return}
            
        let counter_modifier = parent.FindModifierByName("modifier_temari_innate_passive_buff_counter")
        if(!counter_modifier){return}
        if(counter_modifier.GetStackCount() === 1){
            parent.RemoveModifierByName("modifier_temari_innate_passive_buff_counter")
        }else{
            counter_modifier.DecrementStackCount()
        }
    }
}
