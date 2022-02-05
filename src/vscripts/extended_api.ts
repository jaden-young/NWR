export {}
declare global {
    interface CDOTA_BaseNPC {
        GetAllAbilities(): CDOTABaseAbility[];
        HasTalent(talentName: string): boolean;
        GetTalent(talentName: string): number;
        FindTalentValue(talentName: string, key?: string): number
    }
}

if (IsServer()) {
    CDOTA_BaseNPC.GetAllAbilities = function() {
        let abilities: CDOTABaseAbility[] = [];
        for (let i=0; i<DOTA_MAX_ABILITIES; i++) {
            let ability = this.GetAbilityByIndex(i);
            if (ability) {
                abilities.push(ability);
            }
        }
        return abilities;
    }
    CDOTA_BaseNPC.HasTalent = function (talentName: string) {
        let talent = this.FindAbilityByName(talentName)
        return talent ? talent.GetLevel()>0 : false;
    }
    CDOTA_BaseNPC.GetTalent = function (talentName: string) {
        let talent = this.FindAbilityByName(talentName);
        return talent ? talent.GetSpecialValueFor("value") : 0;
    }

    CDOTA_BaseNPC.FindTalentValue = function (talentName: string, key?: string){
        let talent = this.FindAbilityByName(talentName);
        return talent ? talent.GetSpecialValueFor(key ? key : "value") : 0
    }
}
