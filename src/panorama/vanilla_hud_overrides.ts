//@ts-nocheck
var Parent = $.GetContextPanel().GetParent().GetParent().GetParent();

function SetCustomHUD() {
	HideAghs();
	SetTopBarBackground();
	SetInventoryBackground();
	SetAbilityBackground();
	SetMinimapBackground();
	SetPortraitBackground();
}

const OnOverrideHeroImage = ({player_id}: NetworkedData<OverrideHeroImageEvent>) =>
	OverrideTopBarHeroImage(player_id)

function OverrideTopBarHeroImage(playerId: PlayerID) {
	const team = Players.GetTeam(playerId) == 3 ?
		"Dire" :
		"Radiant";
	const heroName = Players.GetPlayerSelectedHero(playerId);
	const topBarPlayer = Parent?.FindChildTraverse(`${team}Player${playerId}`);
	const heroImage = topBarPlayer?.FindChildTraverse("HeroImage") as HeroImage;
	heroImage?.SetImage(`file://{images}/custom_game/heroes/topbar/${heroName}.png`);
}

function SetTopBarBackground() {
	var container = Parent.FindChildTraverse("HUDSkinTopBarBG");

	container.style.visibility = "visible";
	container.style.backgroundImage = "url('file://{resources}/images/custom_game/hud/tophud.png')";
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
	container.style.backgroundImage = "url('file://{resources}/images/custom_game/hud/dhb_abilities.png')";
	container.style.backgroundSize = "103% 105%"; //103 104
	container.style.backgroundPosition = "0px -8px"; // -6 -7
	container.style.backgroundRepeat = "no-repeat";

	container2.style.height = "145px"; // 138px
	container2.style.backgroundImage = "url('file://{resources}/images/custom_game/hud/dhb_inventory2.png')";
	container2.style.backgroundSize = "100% 100%";
	container2.style.backgroundRepeat = "no-repeat";
}

function SetAbilityBackground() {
	var container = Parent.FindChildTraverse("center_bg");
	var container2 = Parent.FindChildTraverse("right_flare");

	container.style.visibility = "visible";
	container.style.backgroundImage = "url('file://{resources}/images/custom_game/hud/dhb_abilities.png')";
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

	container2.style.backgroundImage = "url('file://{resources}/images/custom_game/hud/dhb_portrait1.png')";
	container2.style.backgroundSize = "90% 90%";
	container2.style.backgroundPosition = "63% -9%";
	container2.style.backgroundRepeat = "no-repeat";
	container2.style.zIndex = "6";

	container3.style.boxShadow = "none";

	container4.style.marginLeft = "49px"; // 52px
	container4.style.marginBottom = "150px"; // 145px
	container4.style.zIndex = "7";
}

function SetMinimapBackground() {
	var container = Parent.FindChildTraverse("HUDSkinMinimap");
	var container2 = Parent.FindChildTraverse("GlyphScanContainer");

	container.style.visibility = "visible";
	container.style.backgroundImage = "url('file://{resources}/images/custom_game/hud/dhb_minimap.png')";
	container.style.backgroundSize = "91.7% 81%";
	container.style.backgroundPosition = "0px 69px";
	container.style.backgroundRepeat = "no-repeat";

	container2.style.backgroundImage = "url('file://{resources}/images/custom_game/hud/dhb_minimap2.png')";
	container2.style.backgroundSize = "100% 100%";
}

function HideAghs() {
	const lowHud = Parent?.FindChildTraverse("lower_hud");
	const aghs = lowHud?.FindChildTraverse("AghsStatusContainer");
	if (aghs) {
		aghs.style.width = "0px";
	}
}

(function() {
	// TODO: wire this up on the server side
	GameEvents.Subscribe("override_hero_image", OverrideTopBarHeroImage);

	SetCustomHUD();
})();
