import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class yondaime_innate_passive extends BaseAbility
{
    OnUpgrade(): void {
        //Should refresh modifier on eanch upgrade
        this.GetCaster().FindModifierByName(this.GetIntrinsicModifierName())?.ForceRefresh()
    }

    GetIntrinsicModifierName(): string {
        return "modifier_yondaime_innate_passive_intrinsic"
    }
}

@registerModifier()
export class modifier_yondaime_innate_passive_intrinsic extends BaseModifier
{
    move_speed_percentage: number = 0
    attack_damage_move_speed_percentage: number = 0

    IsHidden(): boolean {
        return false
    }

    IsPassive(): boolean{
        return true
    }

    DeclareFunctions(){
        return [ModifierFunction.PREATTACK_BONUS_DAMAGE,
                ModifierFunction.MOVESPEED_BONUS_PERCENTAGE]
    }

    OnCreated(params: object): void {
        let ability = this.GetAbility()
        if(ability){
            this.move_speed_percentage = ability.GetSpecialValueFor("move_speed_percentage_base") + (ability.GetSpecialValueFor("move_speed_percentage_per_level_bonus") * (ability.GetLevel() - 1))
            this.attack_damage_move_speed_percentage = ability.GetSpecialValueFor("attack_damage_move_speed_percentage_base") + (ability.GetSpecialValueFor("attack_damage_move_speed_percentage_per_level_bonus") * (ability.GetLevel() - 1))
        }
    }

    OnRefresh(params: object): void {
        let ability = this.GetAbility()
        if(ability){
            this.move_speed_percentage = ability.GetSpecialValueFor("move_speed_percentage_base") + (ability.GetSpecialValueFor("move_speed_percentage_per_level_bonus") * (ability.GetLevel() - 1))
            this.attack_damage_move_speed_percentage = ability.GetSpecialValueFor("attack_damage_move_speed_percentage_base") + (ability.GetSpecialValueFor("attack_damage_move_speed_percentage_per_level_bonus") * (ability.GetLevel() - 1))
            print(this.move_speed_percentage)
            print(this.attack_damage_move_speed_percentage)
            
        }

    }

    GetModifierMoveSpeedBonus_Percentage(){
        return this.move_speed_percentage
    }

    GetModifierPreAttack_BonusDamage(){
        let bonus_attack_damage = this.attack_damage_move_speed_percentage * this.GetParent().GetIdealSpeed() * 0.01
        this.SetStackCount(bonus_attack_damage)

        return bonus_attack_damage
    }
}