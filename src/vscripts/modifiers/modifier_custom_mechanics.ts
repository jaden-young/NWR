import { BaseModifier, registerModifier } from "../lib/dota_ts_adapter";
import { ShortHeroName } from "../lib/util";

@registerModifier()
class modifier_custom_mechanics extends BaseModifier {
    IsHidden(): boolean {
        return false;
    }

    IsPurgable(): boolean {
        return false;
    }

    RemoveOnDeath(): boolean {
        return false;
    }

    OnCreated(params: object): void {
        const short_hero_name = ShortHeroName(this.GetParent().GetUnitName());
        CreateEmptyTalents(short_hero_name);
    }
}
