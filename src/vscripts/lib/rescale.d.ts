declare interface Rescale {
    RescaleUnit(unit: CDOTA_BaseNPC): void,
    RescaleBuildings(): void,
    RescaleShops(): void,
}

declare var Rescale: Rescale;
