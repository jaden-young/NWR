/** @noSelfInFile */

declare function GetItemIndex(itemName: string, unitEntity: CBaseEntity): number | undefined;
declare function StackItem(cd: number, max_stacks: number, modifier_name: string, ability: CDOTABaseAbility, caster: CDOTA_BaseNPC): void;
declare function tableContains(list: LuaTable, element: any): boolean;
declare function getIndex(list: LuaTable, element: any): number;
declare function getUnitIndex(list: LuaTable, element: any): number;
declare function getIndexTable(list: LuaTable, element: any): number;
declare function shallowcopy<T>(orig: T): T;
declare function ShuffledList(orig_list: LuaTable): LuaTable;
declare function TableFindKey(table: LuaTable, val: any): unknown | undefined;
declare function split(inputstr: string, sep: string): LuaTable;
declare function StringStartsWith(fullstring: string, substring: string): boolean;
declare function VectorString(v: Vector): string;
declare function tobool(s: string | number): boolean;
declare function tablelength(T: LuaTable): number;
