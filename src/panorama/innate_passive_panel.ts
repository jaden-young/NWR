var Parent: Panel = $.GetContextPanel()!.GetParent()!.GetParent()!.GetParent()!;

const PRINT_WARNINGS = false;

interface AbilityPanel extends Panel {
    overrideentityindex: number;
    overridedisplaykeybind: number;
}

let cdCheckSchedule: ScheduleID | undefined;
function AddAbilityPanel(abilityID: AbilityEntityIndex, isHero: boolean) {
    const centerHud = Parent!.FindChildTraverse("center_block");
    if (!centerHud) return;
    const xpPanel = centerHud.FindChild("xp");
    if (!xpPanel) return;
    if (centerHud.FindChild("innate_passive_ability")) {
        centerHud.FindChild("innate_passive_ability")!.DeleteAsync(0);
    }

    if (cdCheckSchedule) {
        $.CancelScheduled(cdCheckSchedule);
        cdCheckSchedule = undefined;
    }

    if (!isHero) {
        xpPanel.style.margin = "0";
        return;
    }

    xpPanel.style.margin = "0 0 4px -30px";

    const newPanel = $.CreatePanelWithProperties(
        "Image",
        centerHud,
        "innate_passive_ability",
        {
            src: `file://{images}/custom_game/hud/frame_innate_ability_small.png`,
            scaling: "stretch-to-fit-preserve-aspect",
            style: `width: 95px; height: 180px; vertical-align: bottom;  margin-left: -22px; z-index: 7;`,
            hittest: "false",
        }
    );

    const abilityPanel = $.CreatePanelWithProperties("Panel", newPanel, "", {
        style: "width: 51px; height: 51px; margin: 32px 0 0 16px; border-radius: 50%; box-shadow: inset 0 0 8px #000000f0; border: 1px solid black;",
        hittest: "false",
        class: "Reborn",
    });
    const abilityName = Abilities.GetAbilityName(abilityID);
    const abilityImage = $.CreatePanelWithProperties(
        "DOTAAbilityImage",
        abilityPanel,
        "innate_passive_ability_image",
        {
            abilityname: abilityName,
            style: "tooltip-position: top;",
            hittest: "true",
            onmouseover: `DOTAShowAbilityTooltip('${abilityName}')`,
            onmouseout: "DOTAHideAbilityTooltip()",
        }
    );
    const cooldownPanel = $.CreatePanelWithProperties(
        "Panel",
        abilityPanel,
        "Cooldown",
        {
            hittest: "false",
            style: "visibility: visible; margin: 0;",
        }
    );
    const cooldownOverlay = $.CreatePanelWithProperties(
        "Panel",
        cooldownPanel,
        "CooldownOverlay",
        {
            hittest: "false",
        }
    );
    const cooldownTimer = $.CreatePanelWithProperties(
        "Label",
        cooldownPanel,
        "CooldownTimer",
        {
            class: "MonoNumbersFont",
            hittest: "false",
            text: "3",
        }
    );

    function checkCooldown() {
        cdCheckSchedule = undefined;
        const [percentage, curCD] = GetCooldowns(abilityID);

        const degrees = -360 * percentage;
        cooldownOverlay.style.clip =
            "radial( 50.0% 50.0%, 0.0deg, " + degrees + "deg)";
        cooldownTimer.text = curCD === 0 ? "" : Math.ceil(curCD).toString();

        cdCheckSchedule = $.Schedule(0.1, checkCooldown);
    }
    checkCooldown();
}

let lastEntity: EntityIndex | undefined;
let lastEntityCount = 0;
function CheckUnit() {
    const iPlayerID = Players.GetLocalPlayer();
    const selectedEntities = Players.GetSelectedEntities(iPlayerID);

    const mainSelected = Players.GetLocalPlayerPortraitUnit();
    if (
        lastEntity === undefined ||
        mainSelected !== lastEntity ||
        selectedEntities.length !== lastEntityCount
    ) {
        lastEntity = mainSelected;
        lastEntityCount = selectedEntities.length;
        if (selectedEntities.length > 1) {
            AddAbilityPanel(-1 as AbilityEntityIndex, false);
            $.Schedule(0, CheckUnit);
            return;
        }

        const unitName = Entities.GetUnitName(mainSelected);
        let abilityName = `${unitName.replace(
            "npc_dota_hero_",
            ""
        )}_innate_passive`;
        let abilityID = Entities.GetAbilityByName(mainSelected, abilityName);
        if (abilityID < 0) {
            if (PRINT_WARNINGS)
                $.Msg(
                    `> Innate ability [${abilityName}] not found for ${unitName}]`
                );
            abilityID = Entities.GetAbility(mainSelected, 0);
            abilityName = Abilities.IsHidden(abilityID)
                ? ""
                : Abilities.GetAbilityName(abilityID);
        }

        AddAbilityPanel(
            abilityID,
            Entities.IsHero(mainSelected) && abilityName !== ""
        );
    }

    $.Schedule(0, CheckUnit);
}

CheckUnit();

/**
 * Calculate the current fill percentage for the cooldown of an ability
 * @param abilityID ability entindex
 * @returns [fill percentage, current cooldown]
 */
function GetCooldowns(abilityID: AbilityEntityIndex) {
    const mainSelected = Players.GetLocalPlayerPortraitUnit();
    const cdLength = Abilities.GetCooldownLength(abilityID);
    const curCD = Abilities.GetCooldownTimeRemaining(abilityID);
    let maxCD =
        Abilities.GetCooldown(abilityID) * GetCooldownReduction(mainSelected);
    if (maxCD === 0) {
        return [0, 0];
    }
    if (curCD > maxCD) {
        maxCD = cdLength;
    }
    if (curCD === 0) {
        return [0, 0];
    }
    const ratio = curCD / maxCD;
    return [ratio, curCD];
}

/**
 * Get the cooldown reduction for this unit.
 * @param unitID Unit entindex
 * @returns unit cdr
 */
function GetCooldownReduction(unitID: EntityIndex): number {
    const table = CustomNetTables.GetTableValue(
        "better_cooldowns_cdr",
        unitID.toString()
    );
    if (table) {
        return table["cdr"];
    }
    return 1;
}
