import { BaseModifier } from "../lib/dota_ts_adapter";

export class ModifierSpeed extends BaseModifier {
    // Declare functions
    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.MOVESPEED_ABSOLUTE];
    }

    GetModifierMoveSpeed_Absolute(): number {
        return 300;
    }
}
