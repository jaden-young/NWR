export {}
declare global {
    interface Music {
        PlayKillSound(killer: CDOTA_BaseNPC, killed: CDOTA_BaseNPC): void;
    }
    var Music: Music
}
