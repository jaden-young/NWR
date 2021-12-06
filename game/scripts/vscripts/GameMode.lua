--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["5"] = 1,["6"] = 1,["7"] = 6,["8"] = 7,["9"] = 8,["10"] = 13,["11"] = 21,["12"] = 22,["13"] = 21,["15"] = 34,["16"] = 37,["17"] = 37,["18"] = 37,["19"] = 37,["20"] = 37,["21"] = 38,["22"] = 38,["23"] = 38,["24"] = 38,["25"] = 38,["26"] = 41,["27"] = 41,["28"] = 41,["29"] = 42,["30"] = 42,["31"] = 42,["32"] = 45,["33"] = 46,["34"] = 54,["35"] = 41,["36"] = 41,["37"] = 33,["38"] = 23,["39"] = 24,["40"] = 25,["41"] = 23,["42"] = 28,["43"] = 30,["44"] = 28,["45"] = 59,["46"] = 60,["47"] = 61,["48"] = 63,["49"] = 64,["50"] = 59,["51"] = 67,["52"] = 68,["53"] = 77,["54"] = 79,["55"] = 80,["56"] = 80,["57"] = 80,["58"] = 81,["59"] = 80,["60"] = 80,["63"] = 87,["64"] = 88,["65"] = 88,["66"] = 88,["67"] = 88,["69"] = 67,["70"] = 92,["71"] = 93,["72"] = 92,["73"] = 99,["74"] = 100,["75"] = 99,["76"] = 105,["77"] = 107,["78"] = 105,["79"] = 21});
local ____exports = {}
local ____tstl_2Dutils = require("lib.tstl-utils")
local reloadable = ____tstl_2Dutils.reloadable
require("components.garbage_collector")
require("components.barebones.settings")
require("components.vanilla_extension")
local heroSelectionTime = 20
____exports.GameMode = __TS__Class()
local GameMode = ____exports.GameMode
GameMode.name = "GameMode"
function GameMode.prototype.____constructor(self)
    self:configure()
    ListenToGameEvent(
        "game_rules_state_change",
        function() return self:OnStateChange() end,
        nil
    )
    ListenToGameEvent(
        "npc_spawned",
        function(event) return self:OnNpcSpawned(event) end,
        nil
    )
    CustomGameEventManager:RegisterListener(
        "ui_panel_closed",
        function(_, data)
            print(
                ("Player " .. tostring(data.PlayerID)) .. " has closed their UI panel."
            )
            local player = PlayerResource:GetPlayer(data.PlayerID)
            CustomGameEventManager:Send_ServerToPlayer(player, "example_event", {myNumber = 42, myBoolean = true, myString = "Hello!", myArrayOfNumbers = {1.414, 2.718, 3.142}})
            local hero = player:GetAssignedHero()
        end
    )
end
function GameMode.Precache(context)
    PrecacheResource("particle", "particles/units/heroes/hero_meepo/meepo_earthbind_projectile_fx.vpcf", context)
    PrecacheResource("soundfile", "soundevents/game_sounds_heroes/game_sounds_meepo.vsndevts", context)
end
function GameMode.Activate()
    GameRules.Addon = __TS__New(____exports.GameMode)
end
function GameMode.prototype.configure(self)
    GameRules:SetCustomGameTeamMaxPlayers(DOTA_TEAM_GOODGUYS, 5)
    GameRules:SetCustomGameTeamMaxPlayers(DOTA_TEAM_BADGUYS, 5)
    GameRules:SetShowcaseTime(0)
    GameRules:SetHeroSelectionTime(heroSelectionTime)
end
function GameMode.prototype.OnStateChange(self)
    local state = GameRules:State_Get()
    if state == DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP then
        if IsInToolsMode() then
            Timers:CreateTimer(
                3,
                function()
                    GameRules:FinishCustomGameSetup()
                end
            )
        end
    end
    if state == DOTA_GAMERULES_STATE_PRE_GAME then
        Timers:CreateTimer(
            0.2,
            function() return self:StartGame() end
        )
    end
end
function GameMode.prototype.StartGame(self)
    print("Game starting!")
end
function GameMode.prototype.Reload(self)
    print("Script reloaded!")
end
function GameMode.prototype.OnNpcSpawned(self, event)
    local unit = EntIndexToHScript(event.entindex)
end
GameMode = __TS__Decorate({reloadable}, GameMode)
return ____exports
