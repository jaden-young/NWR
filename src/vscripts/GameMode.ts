import { reloadable } from "./lib/tstl-utils";
import { modifier_panic } from "./modifiers/modifier_panic";
import "./extended_api";
import "./items";
import "./lib/rescale";
import "./lib/timers";
import "./lib/popups";
import "./lib/keyvalues";
import "./lib/vanilla_extension"
import { ShortHeroName } from "./lib/util";
import "./components/lul/label";

// imports that are only here to get lua libs into game/
import "./modifiers/modifier_generic_custom_indicator";
import "./lib/adv_log";
import "./lib/better_cooldown";
import "./components/barebones/physics";
import "./components/barebones/util";
import "./components/voicelines/voicelines";
import { malulubul } from "./components/lul/malubulul";
// include to print all event data in console, also uncomment in RegisterGameEvents
// import "./components/barebones/eventtest";

//Importing lua libraries
require("components/garbage_collector");
// TODO: Fix barebones editing gamemode object
// require("components/barebones/events")
require("modifiers/modifier_responses");
require("components/demo/init");

const heroSelectionTime = 20;

declare global {
    interface CDOTAGamerules {
        Addon: GameMode;
    }
}

@reloadable
export class GameMode {
    Game: CDOTABaseGameMode = GameRules.GetGameModeEntity();
    /**
     * Set of heroes that have spawned in the game at least once.
     */
    spawned_heros: Set<string> = new Set();

    public static Precache(this: void, context: CScriptPrecacheContext) {
        PrecacheResource("soundfile", "soundevents/music/nwr_team_selection.vsndevts", context);
        PrecacheResource("soundfile", "soundevents/music/nwr_hero_selection.vsndevts", context);

        PrecacheResource("soundfile", "soundevents/heroes/kakashi_soundevents.vsndevts", context)
        PrecacheResource("soundfile", "soundevents/heroes/haku_soundevents.vsndevts", context)
        PrecacheResource("soundfile", "soundevents/heroes/hidan_soundevents.vsndevts", context)
        PrecacheResource("soundfile", "soundevents/heroes/zabuza_soundevents.vsndevts", context)
        // PrecacheResource("soundfile", "soundevents/heroes/madara_soundevents.vsndevts", context)
        PrecacheResource("soundfile", "soundevents/heroes/kisame_soundevents.vsndevts", context)
        PrecacheResource("soundfile", "soundevents/heroes/gaara_soundevents.vsndevts", context)
        PrecacheResource("soundfile", "soundevents/heroes/yondaime_soundevents.vsndevts", context)
        // PrecacheResource("soundfile", "soundevents/heroes/naruto_soundevents.vsndevts", context)
        PrecacheResource("soundfile", "soundevents/heroes/neji_soundevents.vsndevts", context)
        PrecacheResource("soundfile", "soundevents/heroes/guy_soundevents.vsndevts", context)
        PrecacheResource("soundfile", "soundevents/heroes/onoki_soundevents.vsndevts", context)
        PrecacheResource("soundfile", "soundevents/heroes/raikage_soundevents.vsndevts", context)
        PrecacheResource("soundfile", "soundevents/heroes/sakura_soundevents.vsndevts", context)
        // PrecacheResource("soundfile", "soundevents/heroes/sasuke_soundevents.vsndevts", context)
        PrecacheResource("soundfile", "soundevents/heroes/shikamaru_soundevents.vsndevts", context)
        PrecacheResource("soundfile", "soundevents/heroes/temari_soundevents.vsndevts", context)
        PrecacheResource("soundfile", "soundevents/heroes/anko_soundevents.vsndevts", context)
        PrecacheResource("soundfile", "soundevents/heroes/itachi_soundevents.vsndevts", context)
        PrecacheResource("soundfile", "soundevents/global/akat_start.vsndevts", context)
        PrecacheResource("soundfile", "soundevents/global/shinobi_start.vsndevts", context)
        PrecacheResource("soundfile", "soundevents/global/malulubul.vsndevts", context)
        PrecacheResource("soundfile", "soundevents/clones/clone_pop.vsndevts", context)
        PrecacheResource( "model", "models/striker_gaara/striker_gaara_gourd.vmdl", context )
        PrecacheModel("models/striker_gaara/striker_gaara_gourd.vmdl", context)


        // PrecacheResource("soundfile", "soundevents/itachi_crows.vsndevts", context)
        // PrecacheResource("soundfile", "soundevents/itachi_amateratsu.vsndevts", context)
        // PrecacheResource("soundfile", "soundevents/itachi_amateratsu_burning.vsndevts", context)
        // PrecacheResource("soundfile", "soundevents/naruto_rasen_shuriken.vsndevts", context)
        // PrecacheResource("soundfile", "soundevents/naruto_kills_sasuke.vsndevts", context)
        // PrecacheResource("soundfile", "soundevents/sasuke_kills_naruto.vsndevts", context)
        // PrecacheResource("soundfile", "soundevents/sasuke_kills_gaara.vsndevts", context)
        // PrecacheResource("soundfile", "soundevents/sasuke_kills_itachi.vsndevts", context)
        // PrecacheResource("soundfile", "soundevents/madara_trees.vsndevts", context)

        // This call probably belongs somewhere else, but this is where the old
        // repo had it so it was ported directly. Feel free to move/remove it
        // after testing.
        LinkLuaModifier("modifier_custom_mechanics", "modifiers/modifier_custom_mechanics", LuaModifierMotionType.NONE);
    }

    public static Activate(this: void) {
        // When the addon activates, create a new instance of this GameMode class.
        GameRules.Addon = new GameMode();
    }

    constructor() {
        this.configure();
    }

    configure() {
        this.RegisterEvents();
        this.RegisterGameRules();
    }

    RegisterEvents() {
        ListenToGameEvent("game_rules_state_change", () => this.OnStateChange(), undefined);
        ListenToGameEvent("npc_spawned", event => this.OnNpcSpawned(event), undefined);
        ListenToGameEvent("dota_player_learned_ability", event => this.OnPlayerLearnedAbility(event), undefined);
        ListenToGameEvent("entity_killed", event => this.OnEntityKilled(event), undefined);
        ListenToGameEvent("dota_item_purchased", event => this.OnDotaItemPurchased(event), undefined);
        ListenToGameEvent("dota_player_pick_hero", event => this.OnPlayerPickHero(event), undefined);
        ListenToGameEvent("player_chat", event => this.OnPlayerChat(event), undefined);

        // Uncomment to print all event data
        // EventTest.StartEventTest();

        // Register event listeners for events from the UI
        CustomGameEventManager.RegisterListener("ui_panel_closed", (_, data) => {
            print(`Player ${data.PlayerID} has closed their UI panel.`);

            // Respond by sending back an example event
            const player = PlayerResource.GetPlayer(data.PlayerID)!;
            CustomGameEventManager.Send_ServerToPlayer(player, "example_event", {
                myNumber: 42,
                myBoolean: true,
                myString: "Hello!",
                myArrayOfNumbers: [1.414, 2.718, 3.142]
            });
        });
    }

    RegisterGameRules() {
        this.Game.SetRecommendedItemsDisabled(false);
        this.Game.SetCameraDistanceOverride(1134.0);
        this.Game.SetCustomBuybackCostEnabled(false);
        this.Game.SetCustomBuybackCooldownEnabled(false);
        this.Game.SetBuybackEnabled(true);
        this.Game.SetTopBarTeamValuesOverride(true);
        this.Game.SetTopBarTeamValuesVisible(true);
        this.Game.SetUseCustomHeroLevels(false);
        this.Game.SetCustomHeroMaxLevel(25);

        this.Game.SetBotThinkingEnabled(false);
        this.Game.SetTowerBackdoorProtectionEnabled(true);
        this.Game.SetFogOfWarDisabled(false);
        this.Game.SetGoldSoundDisabled(false);
        this.Game.SetRemoveIllusionsOnDeath(false);
        this.Game.SetAlwaysShowPlayerInventory(false);
        this.Game.SetAnnouncerDisabled(false);

        // -1 = default
        this.Game.SetFixedRespawnTime(-1);
        this.Game.SetFountainConstantManaRegen(-1);
        this.Game.SetFountainPercentageHealthRegen(-1);
        this.Game.SetFountainPercentageManaRegen(-1);

        this.Game.SetLoseGoldOnDeath(true);
        this.Game.SetMaximumAttackSpeed(600);
        this.Game.SetMinimumAttackSpeed(20);
        this.Game.SetStashPurchasingDisabled(false);

        this.Game.SetRuneEnabled(RuneType.DOUBLEDAMAGE, true);
        this.Game.SetRuneEnabled(RuneType.HASTE, true);
        this.Game.SetRuneEnabled(RuneType.ILLUSION, true);
        this.Game.SetRuneEnabled(RuneType.INVISIBILITY, true);
        this.Game.SetRuneEnabled(RuneType.REGENERATION, true);
        this.Game.SetRuneEnabled(RuneType.BOUNTY, true);
        // TODO: other rune types?

        this.Game.SetFreeCourierModeEnabled(true);

        GameRules.SetHeroRespawnEnabled(true);
        GameRules.SetUseUniversalShopMode(false);
        GameRules.SetSameHeroSelectionEnabled(false);
        GameRules.SetHeroSelectionTime(heroSelectionTime);

        GameRules.SetPreGameTime(90);
        GameRules.SetPostGameTime(60);
        GameRules.SetTreeRegrowTime(60);

        GameRules.SetUseCustomHeroXPValues(false);
        GameRules.SetGoldPerTick(1);
        GameRules.SetGoldTickTime(0.6);

        GameRules.SetUseBaseGoldBountyOnHeroes(false);
        GameRules.SetHeroMinimapIconScale(1);
        GameRules.SetCreepMinimapIconScale(1);
        GameRules.SetRuneMinimapIconScale(1);
        GameRules.SetShowcaseTime(0);

        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.GOODGUYS, 5);
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.BADGUYS, 5);

        GameRules.SetFirstBloodActive(true);
        GameRules.SetHideKillMessageHeaders(false);

        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.GOODGUYS, 5);
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.BADGUYS, 5);

        SetTeamCustomHealthbarColor(DotaTeam.GOODGUYS, 101, 212, 19);
        SetTeamCustomHealthbarColor(DotaTeam.BADGUYS, 243, 201, 9);

        if (GetMapName() == "turbo") {
            GameRules.SetStartingGold(600);
            GameRules.SetPreGameTime(40);
            GameRules.SetUseUniversalShopMode(true);
            this.Game.SetFixedRespawnTime(30);
            this.Game.SetFountainConstantManaRegen(60);
            this.Game.SetFountainPercentageHealthRegen(7);
            this.Game.SetFountainPercentageManaRegen(5);
        }
    }

    public OnStateChange(): void {
        const state = GameRules.State_Get();

        // Add 4 bots to lobby in tools
        // if (IsInToolsMode() && state == GameState.CUSTOM_GAME_SETUP) {
        //     for (let i = 0; i < 4; i++) {
        //         Tutorial.AddBot("npc_dota_hero_lina", "", "", false);
        //     }
        // }

        if (state === GameState.CUSTOM_GAME_SETUP) {
            VoiceResponses.Start();
            EmitGlobalSound("CustomMusic.nwr_team_selection");
            Rescale.RescaleBuildings();
            // Automatically skip setup in tools
            // NO! Enjoy the new song a couple times :)
            // if (IsInToolsMode()) {
            //     Timers.CreateTimer(3, () => {
            //         GameRules.FinishCustomGameSetup();
            //     });
            // }
        }

        if (state == GameState.HERO_SELECTION) {
            StopGlobalSound("CustomMusic.nwr_team_selection");
            EmitGlobalSound("CustomMusic.nwr_hero_selection");
        }

        if(state == GameState.STRATEGY_TIME) {
            Rescale.RescaleShops();
            for (let i = 0; i < PlayerResource.GetPlayerCount(); i++) {
                if (PlayerResource.IsValidPlayer(i)) {
                    const player = PlayerResource.GetPlayer(i);
                    if (player == undefined) return;
                    if (!PlayerResource.HasSelectedHero(i)) {
                        player.MakeRandomHeroSelection();
                    }
                    const hero_name = PlayerResource.GetSelectedHeroName(i);
                    CustomGameEventManager.Send_ServerToPlayer(player, "set_strategy_time_hero_model", { hero_name });
                }
            }
        }

        // Start game once pregame hits
        if (state === GameState.PRE_GAME) {
            StopGlobalSound("CustomMusic.nwr_hero_selection");
            Timers.CreateTimer(0.2, () => this.StartGame());
        }
    }


    private StartGame(): void {
        print("Game starting!");

        // Do some stuff here
    }

    // Called on script_reload
    public Reload() {
        print("Script reloaded!");

        // Do some stuff here
    }

    private OnNpcSpawned(event: NpcSpawnedEvent) {
        const unit = EntIndexToHScript(event.entindex) as CDOTA_BaseNPC; // Cast to npc since this is the 'npc_spawned' event
        if (!unit || unit.GetClassname() == "npc_dota_thinker" || unit.IsPhantom()) {
            return;
        }
        Rescale.RescaleUnit(unit);
        if (unit.IsRealHero()) {
            const shortName = ShortHeroName(unit.GetUnitName());
            if (!this.spawned_heros.has(shortName)) {
                this.OnHeroInGame(unit);
                this.spawned_heros.add(shortName);
            }
        }
    }

    /**
     * Call only once when a hero first enters the game, and don't call again.
     */
    OnHeroInGame(hero: CDOTA_BaseNPC_Hero) {
        const playerId = hero.GetPlayerOwnerID();
        const longName = hero.GetUnitName();
        const shortName = ShortHeroName(longName);
        const configFile = `scripts/vscripts/components/voicelines/keyvalues/${ShortHeroName(longName)}_responses.txt`;

        hero.AddNewModifier(hero, undefined, "modifier_custom_mechanics", undefined);
        VoiceResponses.RegisterUnit(longName, configFile);
        CreateEmptyTalents(shortName);
        if (hero.GetTeamNumber() == 2) {
            print("shinobi start")
            EmitSoundOnEntityForPlayer("shinobi_start", hero, playerId);
        } else {
            print("akat start")
            EmitSoundOnEntityForPlayer("akat_start", hero, playerId);
        }
        CustomGameEventManager.Send_ServerToAllClients("override_hero_image", {});
    }

    OnPlayerLearnedAbility(event: DotaPlayerLearnedAbilityEvent) {
        // necessary for barebones talent logic
        if (event.abilityname.includes("special_bonus_")) {
            const player = EntIndexToHScript(event.player as EntityIndex) as CDOTAPlayer;
            const hero = player.GetAssignedHero();
            const modifierName = `modifier_${event.abilityname}`;
            hero.AddNewModifier(hero, undefined, modifierName, undefined);
        }
    }

    OnEntityKilled(event: EntityKilledEvent): void {
        if (this.Game.GetTopBarTeamValuesOverride()) {
            GameRules.GetGameModeEntity().SetTopBarTeamValue(DotaTeam.BADGUYS, GetTeamHeroKills(DotaTeam.BADGUYS));
            GameRules.GetGameModeEntity().SetTopBarTeamValue(DotaTeam.GOODGUYS, GetTeamHeroKills(DotaTeam.GOODGUYS));
        }
        const killer = EntIndexToHScript(event.entindex_attacker);
        const killed = EntIndexToHScript(event.entindex_killed);
        if (killer != undefined && killed != undefined) {
            SupportItemCooldownReset(killed, killer);
        }
        if (!killer?.IsBaseNPC() || !killer.IsRealHero() || !killed?.IsBaseNPC()) {
            return;
        }
        const team_id = killer.GetTeamNumber();
        const killer_id = killer.GetPlayerID();
        const victim_team_id = killer.GetTeamNumber();
        if (!killed.IsReincarnating() && killed.IsRealHero()) {
            const victim_id = killed.GetPlayerID();
            CustomGameEventManager.Send_ServerToAllClients("hero_killed", { victim_team_id, victim_id, team_id, killer_id });
            return;
        }
        if (killed.IsCreep()) {
            const evtType = team_id == victim_team_id ? "deny" : "lasthit";
            const data = { team_id, killer_id };
            CustomGameEventManager.Send_ServerToAllClients(evtType, data);
            return;
        }
    }

    OnDotaItemPurchased(event: DotaItemPurchasedEvent): void {
        if (event.itemname == "item_forehead_protector") {
            const player = PlayerResource.GetPlayer(event.PlayerID);
            const hero = player?.GetAssignedHero();
            if (hero != undefined) {
                ForeheadProtectorOnItemPickedUp(hero, event.itemname);
            }
        }

        if (event.itemname == "item_flying_courier") {
            Timers.CreateTimer(0.5, () => {
                const courier = Entities.FindByModel(undefined, "models/props_gameplay/donkey_wings.vmdl") as CDOTA_Unit_Courier | undefined;
                courier?.SetModelScale(1.2);
                return undefined;
            })
        }

        if (event.itemname == "courier_radiant_flying") {
            Timers.CreateTimer(0.5, () => {
                const courier = Entities.FindByModel(undefined, "models/props_gameplay/donkey_dire.vmdl") as CDOTA_Unit_Courier | undefined;
                courier?.SetModelScale(1.2);
                return undefined;
            })
        }
    }

    OnDotaItemCombined(event: DotaItemCombinedEvent): void {
        if (event.itemname == "item_chakra_armor") {
            const player = PlayerResource.GetPlayer(event.PlayerID);
            const hero = player?.GetAssignedHero();
            if (hero != undefined) {
                ChakraArmorOnItemPickedUp(hero, event.itemname);
            }
        }
    }

    OnEntityHurt(event: EntityHurtEvent) {
        const killed = EntIndexToHScript(event.entindex_killed)
        if (killed?.IsBaseNPC() && killed.IsIllusion() && !killed.IsAlive()) {
            killed.EmitSound("clone_pop");
        }
    }

    OnPlayerPickHero(event: DotaPlayerPickHeroEvent) {
        const player = EntIndexToHScript(event.player as EntityIndex);
        if (!player?.IsPlayer()) {
            return;
        }
        SetPlayerHealthLabel(player);
    }

    OnPlayerChat(event: PlayerChatEvent) {
        if (event.text == "malubulul") {
            malulubul(event.playerid);
        }
    }
}
