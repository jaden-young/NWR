import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class neji_innate_passive extends BaseAbility
{
    OnUpgrade(): void {
        //Should refresh modifier on eanch upgrade
        this.GetCaster().FindModifierByName(this.GetIntrinsicModifierName())?.ForceRefresh()
    }

    GetIntrinsicModifierName(): string {
        return "modifier_neji_innate_passive_intrinsic"
    }
}

@registerModifier()
export class modifier_neji_innate_passive_intrinsic extends BaseModifier
{
    damage_reduction_per_percent_of_mana: number = 0

    IsHidden(): boolean {
        return true
    }

    IsDebuff(): boolean {
        return false
    }

    IsPassive(): boolean{
        return true
    }

    OnCreated(): void {
        let ability = this.GetAbility()
        if(ability){
            this.damage_reduction_per_percent_of_mana = ability.GetSpecialValueFor("damage_reduction_per_percent_of_mana_base") + (ability.GetSpecialValueFor("damage_reduction_per_percent_of_mana_per_level_bonus") * (ability.GetLevel() - 1))
        }
    }

    OnRefresh(): void {
        let ability = this.GetAbility()
        if(ability){
            this.damage_reduction_per_percent_of_mana = ability.GetSpecialValueFor("damage_reduction_per_percent_of_mana_base") + (ability.GetSpecialValueFor("damage_reduction_per_percent_of_mana_per_level_bonus") * (ability.GetLevel() - 1))
        }
    }

    DeclareFunctions(){
        return [ModifierFunction.INCOMING_DAMAGE_PERCENTAGE]
    }

    GetModifierIncomingDamage_Percentage(){
        let parent = this.GetParent()
        return 100 - (this.damage_reduction_per_percent_of_mana * (parent.GetMana() / parent.GetMaxMana()) * 100)
    }
}