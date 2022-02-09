export {};
declare global {
    enum PopupPreSymbol {
        Plus = 0,
        Minus = 1,
        SadFace = 2,
        BrokenArrow = 3,
        Shades = 4,
        Miss = 5,
        Evade = 6,
        Deny = 7,
        Arrow = 8,
    }
    enum PopupPostSymbol {
        Exclamation = 0,
        PointZero = 1,
        Medal = 2,
        Drop = 3,
        Lightning = 4,
        Skull = 5,
        Eye = 6,
        Shield = 7,
        PointFive = 8,
    }
    function PopupNumbers(target: CBaseEntity, pfx: string, color: Vector, lifetime: number, presymbol: PopupPreSymbol, postsymbol: PopupPostSymbol): void;
    function PopupHealing(target: CBaseEntity, amount: number): void;
    function PopupDamage(target: CBaseEntity, amount: number): void;
    function PopupCriticalDamage(target: CBaseEntity, amount: number): void;
    function PopupDamageOverTime(target: CBaseEntity, amount: number): void;
    function PopupDamageBlock(target: CBaseEntity, amount: number): void;
    function PopupGoldGain(target: CBaseEntity, amount: number): void;
    function PopupMiss(target: CBaseEntity, amount: number): void;
    function PopupExperience(target: CBaseEntity, amount: number): void;
    function PopupMana(target: CBaseEntity, amount: number): void;
    function PopupManaDrain(target: CBaseEntity, amount: number): void;
    function PopupHealthTome(target: CBaseEntity, amount: number): void;
    function PopupStrTome(target: CBaseEntity, amount: number): void;
    function PopupAgiTome(target: CBaseEntity, amount: number): void;
    function PopupIntTome(target: CBaseEntity, amount: number): void;
    function PopupBleedingOverTime(target: CBaseEntity, amount: number): void;
    function PopupMaterials(target: CBaseEntity, amount: number): void;
}
