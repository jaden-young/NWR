import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter";

@registerAbility()
class itachi_anbu_training extends BaseAbility {
    BaseProperties: AbilityBaseProperties = {
        ManaCost: 30
    }
}
