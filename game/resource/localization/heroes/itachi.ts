import { AbilityLocalization, LocalizationData, ModifierLocalization, StandardLocalization } from "~generator/localizationInterfaces";
import { Language } from "../../languages";

// DigitalG:
// This is template for new localization file
// if you want to add new localization file (e.g. new hero) please copy this file
// DON't EDIT THIS

export function GenerateLocalizationData(): LocalizationData
{
    // This section can be safely ignored, as it is only logic.
    //#region Localization logic
    // Arrays
    const Abilities: Array<AbilityLocalization> = new Array<AbilityLocalization>();
    const Modifiers: Array<ModifierLocalization> = new Array<ModifierLocalization>();
    const StandardTooltips: Array<StandardLocalization> = new Array<StandardLocalization>();

    // Create object of arrays
    const localization_info: LocalizationData =
    {
        AbilityArray: Abilities,
        ModifierArray: Modifiers,
        StandardArray: StandardTooltips,
    };
    //#endregion

    // Enter localization data below!
    StandardTooltips.push({
        classname: "npc_dota_hero_itachi",
        name: "Itachi"
    });

    // Return data to compiler
    return localization_info;
}
