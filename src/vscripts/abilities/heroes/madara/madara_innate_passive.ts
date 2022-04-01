import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class madara_innate_passive extends BaseAbility
{
    OnUpgrade(): void {
        //Should refresh modifier on eanch upgrade
        let caster = this.GetCaster()
        caster.FindModifierByName(this.GetIntrinsicModifierName())?.ForceRefresh()
        let counter_modifier = caster.FindModifierByName("modifier_madara_innate_passive_buff_counter")
        if(counter_modifier){
            (counter_modifier as modifier_madara_innate_passive_buff_counter).UpdateNumbers()
        }
    }

    GetIntrinsicModifierName(): string {
        return "modifier_madara_innate_passive_intrinsic"
    }
}

@registerModifier()
export class modifier_madara_innate_passive_intrinsic extends BaseModifier
{
    IsHidden(): boolean {
        return true;
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
        if(event.target !== this.GetParent()){return}
        if(event.attacker.GetTeam() === this.GetParent().GetTeam()){return}

        // this.ApplyStack()
        let parent = this.GetParent()
        let ability = this.GetAbility()
        if(ability){
            let stack_duration = ability.GetSpecialValueFor("stack_duration_base") + (ability.GetSpecialValueFor("stack_duration_per_level_bonus") + (ability.GetLevel() - 1))
            print(stack_duration)
            parent.AddNewModifier(parent, ability, "modifier_madara_innate_passive_buff", {duration: stack_duration})
        }
    }
}

@registerModifier()
export class modifier_madara_innate_passive_buff extends BaseModifier
{
    IsHidden(): boolean {
        return true;
    }

    IsDebuff(): boolean {
        return false;
    }

    IsPurgable(): boolean {
        return false;
    }

    GetAttributes(): ModifierAttribute {
        return ModifierAttribute.MULTIPLE
    }

    OnCreated(params: object): void {
        let parent = this.GetParent()
        let ability = this.GetAbility()
        if(!IsServer()){return}
        if(!ability){return}
        let max_stacks = ability.GetSpecialValueFor("max_stacks_base") + (ability.GetSpecialValueFor("max_stacks_per_level_bonus") + (ability.GetLevel() - 1))
        let stack_duration = ability.GetSpecialValueFor("stack_duration_base") + (ability.GetSpecialValueFor("stack_duration_per_level_bonus") + (ability.GetLevel() - 1))
        if(parent.HasModifier("modifier_madara_innate_passive_buff_counter")){
            let counter_modifier = parent.FindModifierByName("modifier_madara_innate_passive_buff_counter")
            if(!counter_modifier){return}
            let current_stacks = counter_modifier.GetStackCount()
            if(current_stacks === max_stacks){
                let buff_modifiers = parent.FindAllModifiersByName("modifier_madara_innate_passive_buff")
                buff_modifiers[0].Destroy()
                counter_modifier.SetDuration(stack_duration, true)
                counter_modifier.IncrementStackCount()
            }else{
                counter_modifier.IncrementStackCount()
                counter_modifier.SetDuration(stack_duration, true)
            }
        }else{
            let new_counter_modifier = parent.AddNewModifier(parent, ability,"modifier_madara_innate_passive_buff_counter", {duration: stack_duration})
            new_counter_modifier.SetStackCount(1)
        }
    }

    OnDestroy(): void {
        if(!IsServer()){return}
        let parent = this.GetParent()
        let ability = this.GetAbility()
        if(!ability){return}
        let max_stacks = ability.GetSpecialValueFor("max_stacks_base") + (ability.GetSpecialValueFor("max_stacks_per_level_bonus") + (ability.GetLevel() - 1))
        let stack_duration = ability.GetSpecialValueFor("stack_duration_base") + (ability.GetSpecialValueFor("stack_duration_per_level_bonus") + (ability.GetLevel() - 1))
    
        let counter_modifier = parent.FindModifierByName("modifier_madara_innate_passive_buff_counter")
        if(!counter_modifier){return}
        if(counter_modifier.GetStackCount() === 1){
            parent.RemoveModifierByName("modifier_madara_innate_passive_buff_counter")
        }else{
            counter_modifier.DecrementStackCount()
        }
    }
}

@registerModifier()
export class modifier_madara_innate_passive_buff_counter extends BaseModifier
{
    spell_damage_bonus_per_stack: number = 0
    health_regen_per_stack: number = 0

    IsHidden(): boolean {
        return false;
    }

    IsDebuff(): boolean {
        return false;
    }

    IsPurgable(): boolean {
        return false;
    }

    UpdateNumbers(){
        let ability = this.GetAbility()
        if(!ability){return}
        this.spell_damage_bonus_per_stack = ability.GetSpecialValueFor("spell_damage_bonus_per_stack")
        this.health_regen_per_stack = ability.GetSpecialValueFor("health_regen_per_stack_base") + (ability.GetSpecialValueFor("health_regen_per_stack_per_level_bonus") * (ability.GetLevel() - 1))
    }

    OnCreated(): void {
        this.UpdateNumbers()
    }

    DeclareFunctions(){
        return [ModifierFunction.HEALTH_REGEN_CONSTANT,
                ModifierFunction.SPELL_AMPLIFY_PERCENTAGE]
    }

    GetModifierConstantHealthRegen(){
        return this.GetStackCount() * this.health_regen_per_stack
    }

    GetModifierSpellAmplify_Percentage(){
        return this.GetStackCount() * this.spell_damage_bonus_per_stack
    }
}