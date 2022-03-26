import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class guy_innate_passive extends BaseAbility
{
    OnUpgrade(): void {
        //Should refresh modifier on eanch upgrade
        this.GetCaster().FindModifierByName(this.GetIntrinsicModifierName())?.ForceRefresh()
    }

    GetIntrinsicModifierName(): string {
        return "modifier_guy_innate_passive_intrinsic"
    }
}

@registerModifier()
export class modifier_guy_innate_passive_intrinsic extends BaseModifier {
    status_resistance_per_percentage_hp_missing?: number;
    
    IsDebuff(): boolean {
        return false
    }

    IsHidden(): boolean {
        return false
    }

    OnCreated(params: object): void {
        this.status_resistance_per_percentage_hp_missing = this.GetAbility()?.GetSpecialValueFor("status_resistance_per_percentage_hp_missing")
    }

    OnRefresh(params: object): void {
        this.status_resistance_per_percentage_hp_missing = this.GetAbility()?.GetSpecialValueFor("status_resistance_per_percentage_hp_missing")
    }

    DeclareFunctions() {
        return [ModifierFunction.STATUS_RESISTANCE]
    }

    GetModifierStatusResistance() {
        return (100 - (this.GetParent().GetHealthPercent())) * (this.status_resistance_per_percentage_hp_missing ?? 0)
    }
}