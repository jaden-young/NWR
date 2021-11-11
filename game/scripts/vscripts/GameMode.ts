import { reloadable } from "./lib/tstl-utils";
import "./modifiers/modifier_panic";

//Importing lua libraries
require("components/garbage_collector")
require("components/barebones/settings")
require('components/vanilla_extension')
// TODO: Fix barebones editing gamemode object 
// require("components/barebones/events")


const heroSelectionTime = 10;

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
    }

    public static Activate(this: void) {
        GameRules.Addon = new GameMode();
        // Loading KV for some items (maybe we will need that in future)
        // GameRules.heroKV = LoadKeyValues("scripts/npc/npc_heroes_custom.txt") 
    }

    //InitGameMode() in Lua
    constructor() {
        this.configure();
        ListenToGameEvent("game_rules_state_change", () => this.OnStateChange(), undefined);
        ListenToGameEvent("npc_spawned", event => this.OnNpcSpawned(event), undefined);
    }

    private configure(): void {
        // GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.GOODGUYS, 3);
        // GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.BADGUYS, 3);

        // GameRules.SetShowcaseTime(0);
        // GameRules.SetHeroSelectionTime(heroSelectionTime);
    }

    public OnStateChange(): void {
        const state = GameRules.State_Get();

        // Add 4 bots to lobby in tools
        // if (IsInToolsMode() && state == GameState.CUSTOM_GAME_SETUP) {
        //     for (let i = 0; i < 4; i++) {
        //         Tutorial.AddBot("npc_dota_hero_lina", "", "", false);
        //     }
        // }

        // Start game once pregame hits
        if (state == GameState.PRE_GAME) {
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
        // After a hero unit spawns, apply modifier_panic for 8 seconds
        const unit = EntIndexToHScript(event.entindex) as CDOTA_BaseNPC; // Cast to npc since this is the 'npc_spawned' event
        // if (unit.IsRealHero()) {
        //     Timers.CreateTimer(1, () => {
        //         unit.AddNewModifier(unit, undefined, "modifier_panic", { duration: 8 });
        //     });

        //     if (!unit.HasAbility("meepo_earthbind_ts_example")) {
        //         // Add lua ability to the unit
        //         unit.AddAbility("meepo_earthbind_ts_example");
        //     }
        // }
    }
}
