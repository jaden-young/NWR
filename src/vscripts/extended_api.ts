export {}
declare global {
    interface CDOTA_BaseNPC {
        GetAllAbilities(): CDOTABaseAbility[];
        GetTalent(talentName: string): number;
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

    CDOTA_BaseNPC.GetTalent = function (talentName: string) {
        let talent = this.FindAbilityByName(talentName);
        return talent ? talent.GetSpecialValueFor("value") : 0;
    }
}
