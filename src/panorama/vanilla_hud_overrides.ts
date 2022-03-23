//@ts-nocheck
var Parent: Panel = $.GetContextPanel()!.GetParent()!.GetParent()!.GetParent()!;

function SetCustomHUD() {
    HideAghs();
    SetTopBarBackground();
    SetInventoryBackground();
    SetAbilityBackground();
    SetMinimapBackground();
    SetPortraitBackground();
}

// One would think that you'd be able to call SetImage on a HeroImage panel,
// but there's some weird timing/races. It works after things are totally
// loaded in, but I haven't been able to find a good signal for that, and
// waiting some number of seconds feels fragile. Instead, just add a new panel
// on top with an image that will definitely be there.
function OverrideImage(hParent, sHeroName) {
    var newheroimage = $.CreatePanel("Panel", hParent, "");
    newheroimage.style.width = "100%";
    newheroimage.style.height = "100%";
    newheroimage.style.backgroundImage =
        'url("file://{images}/custom_game/heroes/topbar/' +
        sHeroName +
        '.png")';
    newheroimage.style.backgroundSize = "cover";
}

function OverrideTopBarHeroImages() {
    for (let i = 0; i < 10; i++) {
        const playerInfo = Game.GetPlayerInfo(i);
        if (playerInfo) {
            let container = Parent.FindChildTraverse("RadiantPlayer" + i);
            if (container) {
                let heroImage = container.FindChildTraverse("HeroImage") as
                    | HeroImage
                    | undefined;
                OverrideImage(heroImage, playerInfo.player_selected_hero);
            } else {
                container = Parent.FindChildTraverse("DirePlayer" + i);
                if (container) {
                    let heroImage = container.FindChildTraverse("HeroImage") as
                        | HeroImage
                        | undefined;
                    OverrideImage(heroImage, playerInfo.player_selected_hero);
                }
            }
        }
    }
}

function SetTopBarBackground() {
    var container = Parent.FindChildTraverse("HUDSkinTopBarBG");

    container.style.visibility = "visible";
    container.style.backgroundImage =
        "url('file://{resources}/images/custom_game/hud/tophud.png')";
    container.style.backgroundSize = "100% 100%";
    container.style.width = "57.8%";
    container.style.height = "90px";

    var backgrounds = Parent.FindChildrenWithClassTraverse("TopBarBackground");

    for (var i = 0; i < backgrounds.length; i++) {
        var child = backgrounds[i];
        child.style.backgroundImage = "none";
    }
}

function SetInventoryBackground() {
    var container = Parent.FindChildTraverse("HUDSkinInventoryBG");
    var container2 = Parent.FindChildTraverse("right_flare");

    container.style.visibility = "visible";
    container.style.backgroundImage =
        "url('file://{resources}/images/custom_game/hud/dhb_abilities.png')";
    container.style.backgroundSize = "103% 105%"; //103 104
    container.style.backgroundPosition = "0px -8px"; // -6 -7
    container.style.backgroundRepeat = "no-repeat";

    if (!container2) return;
    container2.style.height = "145px"; // 138px
    container2.style.backgroundImage =
        "url('file://{resources}/images/custom_game/hud/dhb_inventory2.png')";
    container2.style.backgroundSize = "100% 100%";
    container2.style.backgroundRepeat = "no-repeat";

    const rightParticles = container2.FindChild(
        "HUDSkinPreCenterParticlesRight"
    );
    if (rightParticles) rightParticles.visible = false;

    const leftHudSkin = Parent.FindChildTraverse(
        "HUDSkinPreCenterParticlesLeft"
    );
    if (leftHudSkin) leftHudSkin.visible = false;
}

function SetAbilityBackground() {
    var container = Parent.FindChildTraverse("center_bg");
    var container2 = Parent.FindChildTraverse("right_flare");

    container.style.visibility = "visible";
    container.style.backgroundImage =
        "url('file://{resources}/images/custom_game/hud/dhb_abilities.png')";
    container.style.backgroundSize = "100% 105%";
    container.style.backgroundPosition = "0% -8px";
    container.style.backgroundRepeat = "no-repeat";
}

function SetPortraitBackground() {
    var container = Parent.FindChildTraverse("left_flare");
    var container2 = Parent.FindChildTraverse("HUDSkinPortrait");
    var container3 = Parent.FindChildTraverse("HUDSkinStatBranchGlow");
    var container4 = Parent.FindChildTraverse("unitname");

    container.style.visibility = "collapse";

    container2.style.backgroundImage =
        "url('file://{images}/custom_game/hud/dhb_portrait1_simple.png')";
    container2.style.backgroundSize = "90% 90%";
    container2.style.backgroundPosition = "63% -9%";
    container2.style.backgroundRepeat = "no-repeat";
    container2.style.zIndex = "6";
    container2.style.visibility = "visible";

    container3.style.boxShadow = "none";

    container4.style.marginLeft = "23px";
    container4.style.marginBottom = "145px";
    container4.style.zIndex = "7";
}

function SetMinimapBackground() {
    var container = Parent.FindChildTraverse("HUDSkinMinimap");
    var container2 = Parent.FindChildTraverse("GlyphScanContainer");

    container.style.visibility = "visible";
    container.style.backgroundImage =
        "url('file://{resources}/images/custom_game/hud/dhb_minimap.png')";
    container.style.backgroundSize = "91.7% 81%";
    container.style.backgroundPosition = "0px 69px";
    container.style.backgroundRepeat = "no-repeat";

    container2.style.backgroundImage =
        "url('file://{resources}/images/custom_game/hud/dhb_minimap2.png')";
    container2.style.backgroundSize = "100% 100%";
}

function HideAghs() {
    const lowHud = Parent?.FindChildTraverse("lower_hud");
    const aghs = lowHud?.FindChildTraverse("AghsStatusContainer");
    if (aghs) {
        aghs.style.width = "0px";
    }
}

(function () {
    GameEvents.Subscribe("override_hero_images", OverrideTopBarHeroImages);
    OverrideTopBarHeroImages();
    SetCustomHUD();
})();
