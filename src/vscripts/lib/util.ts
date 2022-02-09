import "./utilities";

export function ShortHeroName(fullUnitName: string): string {
    return fullUnitName.replace("npc_dota_hero_", "")
}
