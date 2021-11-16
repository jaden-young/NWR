--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["5"] = 1,["6"] = 1,["7"] = 5,["8"] = 6,["9"] = 7,["10"] = 12,["11"] = 20,["12"] = 21,["13"] = 20,["15"] = 33,["16"] = 36,["17"] = 36,["18"] = 36,["19"] = 36,["20"] = 36,["21"] = 37,["22"] = 37,["23"] = 37,["24"] = 37,["25"] = 37,["26"] = 40,["27"] = 40,["28"] = 40,["29"] = 41,["30"] = 41,["31"] = 41,["32"] = 44,["33"] = 45,["34"] = 53,["35"] = 40,["36"] = 40,["37"] = 32,["38"] = 22,["39"] = 23,["40"] = 24,["41"] = 22,["42"] = 27,["43"] = 29,["44"] = 27,["45"] = 58,["46"] = 59,["47"] = 60,["48"] = 62,["49"] = 63,["50"] = 58,["51"] = 66,["52"] = 67,["53"] = 76,["54"] = 78,["55"] = 79,["56"] = 79,["57"] = 79,["58"] = 80,["59"] = 79,["60"] = 79,["63"] = 86,["64"] = 87,["65"] = 87,["66"] = 87,["67"] = 87,["69"] = 66,["70"] = 91,["71"] = 92,["72"] = 91,["73"] = 98,["74"] = 99,["75"] = 98,["76"] = 104,["77"] = 106,["78"] = 104,["79"] = 20});
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
