/** @noSelfInFile */
export { };
declare global {
    function DebugPrint(...args: any[]): void;
    function DebugPrintTable(...args: any[]): void;
    function PrintTable(...args: any[]): void;

    /**
     * Rolls a Psuedo Random chance. If failed, chances increases, otherwise chances are reset
     * Numbers taken from https://gaming.stackexchange.com/a/290788
     */
    function RollPseudoRandom(base_chance: number, entity: CDOTA_BaseNPC): boolean;
}
