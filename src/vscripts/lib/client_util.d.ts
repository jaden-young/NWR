declare function CreateEmptyTalents(hero: string): void;
/**
 * Client-side implementation of some base NPC extensions.
 * Moddota types don't let me extend C_DOTA_BaseNPC.
 */
declare interface CDOTA_BaseNPC {
    HasTalent(talentName: string): boolean;
    FindTalentValue(talentName: string, key?: string): number;
    GetTalentSpecialValueFor(value: string): number;
    HasShard(): boolean;
}