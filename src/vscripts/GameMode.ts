import { reloadable } from "./lib/tstl-utils";
import { modifier_panic } from "./modifiers/modifier_panic";
import "./extended_api";
import "./lib/rescale";


//Importing lua libraries
require("components/garbage_collector")
require("components/barebones/settings")
require('components/vanilla_extension')
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
    public static Precache(this: void, context: CScriptPrecacheContext) {
        PrecacheResource("particle", "particles/units/heroes/hero_meepo/meepo_earthbind_projectile_fx.vpcf", context);
        PrecacheResource("soundfile", "soundevents/game_sounds_heroes/game_sounds_meepo.vsndevts", context);
        PrecacheResource("soundfile", "soundevents/music/nwr_team_selection.vsndevts", context);
        PrecacheResource("soundfile", "soundevents/music/nwr_hero_selection.vsndevts", context);
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
        // TODO: settings.lua
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.GOODGUYS, 5);
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.BADGUYS, 5);

        GameRules.SetShowcaseTime(0);
        GameRules.SetHeroSelectionTime(heroSelectionTime);
    }

    OnEntityKilled(event: EntityKilledEvent) {
        if (event.entindex_attacker && event.entindex_killed) {
            const attacker = EntIndexToHScript(event.entindex_attacker);
            const killed = EntIndexToHScript(event.entindex_killed);
            if (attacker?.IsBaseNPC() && attacker.IsRealHero() && killed?.IsBaseNPC() && killed.IsRealHero()) {
                attacker.GetUnitLabel()
                Music.PlayKillSound(attacker, killed);
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
    }
}
