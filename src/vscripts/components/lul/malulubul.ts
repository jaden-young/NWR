const steamIds = new Set([
    "76561198094209497",
    "76561197996145212",
    "76561198074948631",
    "76561198071444875",
    "76561197982043049",
    "76561199034723174",
    "76561198000198627",
]);

export function malulubul(playerId: PlayerID) {
    const steamId = PlayerResource.GetSteamID(playerId);
    print("steamId: " + steamId);
    if (!steamIds.has(tostring(steamId))) {
        return;
    }
    const malulubuler = PlayerResource.GetPlayer(playerId);
    EmitSoundOn("malulubul", malulubuler!.GetAssignedHero());
}

