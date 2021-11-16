--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["5"] = 1,["6"] = 2,["7"] = 2,["8"] = 5,["9"] = 5,["10"] = 5,["11"] = 5,["12"] = 10,["13"] = 12});
local ____exports = {}
require("lib.timers")
local ____GameMode = require("GameMode")
local GameMode = ____GameMode.GameMode
__TS__ObjectAssign(
    getfenv(),
    {Activate = GameMode.Activate, Precache = GameMode.Precache}
)
if GameRules.Addon then
    GameRules.Addon:Reload()
end
return ____exports
