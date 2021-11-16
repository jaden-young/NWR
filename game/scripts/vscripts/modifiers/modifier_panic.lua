--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["5"] = 1,["6"] = 1,["7"] = 1,["8"] = 4,["9"] = 4,["10"] = 4,["11"] = 6,["12"] = 7,["13"] = 6,["14"] = 10,["15"] = 11,["16"] = 10,["17"] = 15,["18"] = 16,["19"] = 15,["20"] = 16,["21"] = 18,["22"] = 19,["23"] = 18,["24"] = 25,["25"] = 26,["26"] = 25,["27"] = 30,["28"] = 31,["29"] = 33,["31"] = 30,["32"] = 38,["33"] = 39,["34"] = 41,["35"] = 41,["36"] = 41,["37"] = 38,["38"] = 16,["40"] = 15,["42"] = 16});
local ____exports = {}
local ____dota_ts_adapter = require("lib.dota_ts_adapter")
local BaseModifier = ____dota_ts_adapter.BaseModifier
local registerModifier = ____dota_ts_adapter.registerModifier
local ModifierSpeed = __TS__Class()
ModifierSpeed.name = "ModifierSpeed"
__TS__ClassExtends(ModifierSpeed, BaseModifier)
function ModifierSpeed.prototype.DeclareFunctions(self)
    return {MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE}
end
function ModifierSpeed.prototype.GetModifierMoveSpeed_Absolute(self)
    return 300
end
____exports.modifier_panic = __TS__Class()
local modifier_panic = ____exports.modifier_panic
modifier_panic.name = "modifier_panic"
__TS__ClassExtends(modifier_panic, ModifierSpeed)
function modifier_panic.prototype.CheckState(self)
    return {[MODIFIER_STATE_COMMAND_RESTRICTED] = true}
end
function modifier_panic.prototype.GetModifierMoveSpeed_Absolute(self)
    return 540
end
function modifier_panic.prototype.OnCreated(self)
    if IsServer() then
        self:StartIntervalThink(0.3)
    end
end
function modifier_panic.prototype.OnIntervalThink(self)
    local parent = self:GetParent()
    parent:MoveToPosition(
        parent:GetAbsOrigin() + RandomVector(400)
    )
end
modifier_panic = __TS__Decorate(
    {
        registerModifier(nil)
    },
    modifier_panic
)
return ____exports
