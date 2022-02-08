import { reloadable } from "./lib/tstl-utils";
import { modifier_panic } from "./modifiers/modifier_panic";
import "./extended_api";
import "./lib/rescale";
import "./lib/timers";
import "./lib/popups";
import "./lib/keyvalues";
import "./lib/vanilla_extension"
import { ShortHeroName } from "./lib/util";

// imports that are only here to get lua libs into game/
import "./modifiers/modifier_generic_custom_indicator";
import "./lib/adv_log";
import "./lib/better_cooldown";

//Importing lua libraries
require("components/garbage_collector")
// TODO: Fix barebones editing gamemode object 
// require("components/barebones/events")

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
        PrecacheResource("particle", "particles/units/heroes/hero_meepo/meepo_earthbind_projectile_fx.vpcf", context);
        PrecacheResource("soundfile", "soundevents/game_sounds_heroes/game_sounds_meepo.vsndevts", context);
        PrecacheResource("soundfile", "soundevents/music/nwr_team_selection.vsndevts", context);
        PrecacheResource("soundfile", "soundevents/music/nwr_hero_selection.vsndevts", context);
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
        ListenToGameEvent("entity_killed", event => this.OnEntityKilled(event), undefined);
        ListenToGameEvent("dota_player_learned_ability", event => this.OnPlayerLearnedAbility(event), undefined);

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

        GameRules.SetShowcaseTime(0);

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

    OnEntityKilled(event: EntityKilledEvent) {
        if (event.entindex_attacker && event.entindex_killed) {
            const attacker = EntIndexToHScript(event.entindex_attacker);
            const killed = EntIndexToHScript(event.entindex_killed);
            if (attacker?.IsBaseNPC() && attacker.IsRealHero() && killed?.IsBaseNPC() && killed.IsRealHero()) {
                // TODO: play kill sound for attacker killing killed
            }
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
            // wire up barebones talents
            const shortName = ShortHeroName(unit.GetUnitName());
            if (!this.spawned_heros.has(shortName)) {
                this.spawned_heros.add(shortName);
                unit.AddNewModifier(unit, undefined, "modifier_custom_mechanics", undefined);
                CreateEmptyTalents(shortName);
            }
            CustomGameEventManager.Send_ServerToAllClients("override_hero_image", {});
        }
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
}
