import { ModifierSpeed } from "./modifier_speed";
import { registerModifier } from "../lib/dota_ts_adapter";

@registerModifier()
export class modifier_panic extends ModifierSpeed {
    // Set state
    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.COMMAND_RESTRICTED]: true,
        };
    }

    // Override speed given by Modifier_Speed
    GetModifierMoveSpeed_Absolute(): number {
        return 540;
    }

    // Run when modifier instance is created
    OnCreated(): void {
        if (IsServer()) {
            // Think every 0.3 seconds
            this.StartIntervalThink(0.3);
        }
    }

    // Called when intervalThink is triggered
    OnIntervalThink(): void {
        const parent = this.GetParent();

        parent.MoveToPosition((parent.GetAbsOrigin() + RandomVector(400)) as Vector);
    }
}
