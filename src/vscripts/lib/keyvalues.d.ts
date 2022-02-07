declare function LoadKeyValues(): void;
declare type KeyValueResult = undefined | LuaTable | string | number;
declare function GetKeyValueByHeroName(hero_name: string, key: string): KeyValueResult;
declare function GetKeyValue(name: string, key?: string, level?: number, tbl?: LuaTable): KeyValueResult;
declare function GetUnitKV(unitName: string, key?: string, level?: number): KeyValueResult;
declare function GetAbilityKV(unitName: string, key?: string, level?: number): KeyValueResult;
declare function GetItemKV(unitName: string, key?: string, level?: number): KeyValueResult;
declare function GetAbilitySpecials(name: string): LuaTable | undefined;
declare function GetAbilityCooldown(name: string): number;
declare function GetAbilityManaCost(name: string): number;
declare function GetSpellImmunityType(name: string): string | undefined;
declare function GetSpellDispellableType(name: string): string | undefined;

declare interface CDOTA_BaseNPC {
    GetKeyValue(key: string, level?: number): KeyValueResult;
}

declare interface CDOTABaseAbility {
    GetKeyValue(key: string, level?: number): KeyValueResult;
    GetAbilitySpecial(key: string): KeyValueResult;
}
