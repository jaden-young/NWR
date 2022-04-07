import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class kakashi_innate_passive extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return "modifier_kakashi_innate_passive"
    }

    /****************************************/

    Spawn(): void {
        if (IsServer()) {
            this.SetLevel(1);
        }
    }
}

@registerModifier()
export class modifier_kakashi_innate_passive extends BaseModifier
{
	parent: CDOTA_BaseNPC = this.GetParent();

    damage_per_attr_point?: number;
    stat_res_per_str?: number;
    move_speed_per_agi?: number;
    spell_amp_per_int?: number;

    /****************************************/

    IsHidden(): boolean         {return true}
    IsPurgable(): boolean       {return false}
    RemoveOnDeath(): boolean    {return false}

    /****************************************/

    OnCreated(params: object): void {
        let ability = this.GetAbility()!;

        this.damage_per_attr_point = ability.GetSpecialValueFor("damage_per_attr_point");
        this.stat_res_per_str = ability.GetSpecialValueFor("stat_res_per_str");
        this.move_speed_per_agi = ability.GetSpecialValueFor("move_speed_per_agi");
        this.spell_amp_per_int = ability.GetSpecialValueFor("move_speed_per_agi");
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.BASEATTACK_BONUSDAMAGE,
        ModifierFunction.STATUS_RESISTANCE_STACKING,
        ModifierFunction.MOVESPEED_BONUS_PERCENTAGE,
        ModifierFunction.SPELL_AMPLIFY_PERCENTAGE
    ]}

    /****************************************/

    GetModifierBaseAttack_BonusDamage(): number {
        return this.damage_per_attr_point! * this.GetTotalAttributes() - (this.parent as CDOTA_BaseNPC_Hero).GetAgility();
    }

    /****************************************/

    GetModifierStatusResistanceStacking(): number {
        if (this.GetParent().PassivesDisabled()) return 0;

        return this.stat_res_per_str! * (this.parent as CDOTA_BaseNPC_Hero).GetStrength();
    }

    /****************************************/

    GetModifierMoveSpeedBonus_Percentage(): number {
        if (this.GetParent().PassivesDisabled()) return 0;

        return this.move_speed_per_agi! * (this.parent as CDOTA_BaseNPC_Hero).GetStrength();
    }

    /****************************************/

    GetModifierSpellAmplify_Percentage(): number {
        if (this.GetParent().PassivesDisabled()) return 0;
        
        return this.spell_amp_per_int! * (this.parent as CDOTA_BaseNPC_Hero).GetStrength();
    }

    /****************************************/

    GetTotalAttributes(): number {
        return (this.parent as CDOTA_BaseNPC_Hero).GetStrength() + 
            (this.parent as CDOTA_BaseNPC_Hero).GetAgility() + 
            (this.parent as CDOTA_BaseNPC_Hero).GetIntellect();
    }
}