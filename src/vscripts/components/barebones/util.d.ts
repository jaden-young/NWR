export { };
declare global {
    /**
     * actually takes any number of arguments. Prints if BAREBONES_DEBUG_SPEW is true
     */
    function DebugPrint(this: void, arg1?: any, arg2?: any, arg3?: any, arg4?: any): void;
    /**
     * actually takes any number of arguments. Prints if BAREBONES_DEBUG_SPEW is true
     */
    function DebugPrintTable(this: void, arg1?: any, arg2?: any, arg3?: any, arg4?: any): void;
    function PrintTable(this: void, arg1?: any, arg2?: any, arg3?: any, arg4?: any): void;

    /**
     * Rolls a Psuedo Random chance. If failed, chances increases, otherwise chances are reset
     * Numbers taken from https://gaming.stackexchange.com/a/290788
     */
    function RollPseudoRandom(this: void, base_chance: number, entity: CDOTA_BaseNPC): boolean;
}
