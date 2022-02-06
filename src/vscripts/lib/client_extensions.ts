export { }
declare global {
    interface C_DOTA_BaseNPC {
        HasTalent(talentName: string): boolean;
        GetTalent(talentName: string): number;
        FindTalentValue(talentName: string, key?: string): number
    }
}

C_DOTA_BaseNPC.HasTalent = function (talentName: string) {
    let talent = this.FindAbilityByName(talentName)
    return talent ? talent.GetLevel() > 0 : false;
}

C_DOTA_BaseNPC.GetTalent = function (talentName: string) {
    let talent = this.FindAbilityByName(talentName);
    return talent ? talent.GetSpecialValueFor("value") : 0;
}

C_DOTA_BaseNPC.FindTalentValue = function (talentName: string, key?: string) {
    print("finding talent value client")
    let talent = this.FindAbilityByName(talentName);
    return talent ? talent.GetSpecialValueFor(key ? key : "value") : 0
}
