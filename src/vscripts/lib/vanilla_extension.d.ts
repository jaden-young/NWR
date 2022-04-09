export {}
declare global {
    interface CDOTA_BaseNPC {
        IsCustomHero(): boolean;
        HasTalent(talentName: string): boolean;
        FindTalentValue(talentName: string, key?: string): number;
        HighestTalentTypeValue(talentType: string): number;
        IsRoshan(): boolean;
        HasShard(): boolean;
        // also overrides CreateIllusions
    }
    interface CDOTABaseAbility {
        GetTalentSpecialValueFor(value: string): number;
    }
    /**
     * Has something to do with talent initialization and
     * `modifier_custom_mechanics` that is needed for the e.g. FindTalentValue()
     * extension methods to work.
     * @param hero short hero name, e.g. "naruto"
     */
    function CreateEmptyTalents(this: void, hero: string): void;
}
