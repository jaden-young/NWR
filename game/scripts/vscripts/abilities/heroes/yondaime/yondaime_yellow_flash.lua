local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__Decorate = ____lualib.__TS__Decorate
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["8"] = 1,["9"] = 1,["10"] = 1,["11"] = 1,["12"] = 1,["13"] = 3,["14"] = 4,["15"] = 3,["16"] = 4,["17"] = 6,["18"] = 7,["19"] = 8,["20"] = 6,["21"] = 14,["22"] = 15,["23"] = 17,["24"] = 17,["25"] = 17,["26"] = 17,["27"] = 17,["28"] = 17,["29"] = 18,["30"] = 14,["31"] = 4,["32"] = 3,["33"] = 4,["35"] = 4,["36"] = 22,["37"] = 23,["38"] = 22,["39"] = 23,["40"] = 30,["41"] = 30,["42"] = 30,["43"] = 31,["44"] = 31,["45"] = 31,["46"] = 35,["47"] = 36,["48"] = 38,["49"] = 39,["50"] = 35,["51"] = 44,["52"] = 44,["53"] = 44,["54"] = 52,["55"] = 53,["56"] = 52,["57"] = 58,["58"] = 59,["59"] = 58,["60"] = 64,["61"] = 65,["62"] = 64,["63"] = 70,["64"] = 71,["65"] = 70,["66"] = 76,["67"] = 77,["68"] = 76,["69"] = 23,["70"] = 22,["71"] = 23,["73"] = 23});
local ____exports = {}
local ____dota_ts_adapter = require("lib.dota_ts_adapter")
local BaseAbility = ____dota_ts_adapter.BaseAbility
local BaseModifier = ____dota_ts_adapter.BaseModifier
local registerAbility = ____dota_ts_adapter.registerAbility
local registerModifier = ____dota_ts_adapter.registerModifier
____exports.yondaime_yellow_flash = __TS__Class()
local yondaime_yellow_flash = ____exports.yondaime_yellow_flash
yondaime_yellow_flash.name = "yondaime_yellow_flash"
__TS__ClassExtends(yondaime_yellow_flash, BaseAbility)
function yondaime_yellow_flash.prototype.Precache(self, context)
    PrecacheResource("particle", "particles/units/heroes/yondaime/yondaime_yellow_flash.vpcf", context)
    PrecacheResource("soundfile", "soundevents/heroes/yondaime/game_sounds_yondaime.vsndevts", context)
end
function yondaime_yellow_flash.prototype.OnSpellStart(self)
    local caster = self:GetCaster()
    caster:AddNewModifier(
        caster,
        self,
        "modifier_yondaime_yellow_flash",
        {duration = self:GetSpecialValueFor("duration")}
    )
    EmitSoundOn("Hero_yondaime.YellowFlash.Cast", caster)
end
yondaime_yellow_flash = __TS__Decorate(
    {registerAbility(nil)},
    yondaime_yellow_flash
)
____exports.yondaime_yellow_flash = yondaime_yellow_flash
____exports.modifier_yondaime_yellow_flash = __TS__Class()
local modifier_yondaime_yellow_flash = ____exports.modifier_yondaime_yellow_flash
modifier_yondaime_yellow_flash.name = "modifier_yondaime_yellow_flash"
__TS__ClassExtends(modifier_yondaime_yellow_flash, BaseModifier)
function modifier_yondaime_yellow_flash.prototype.IsPurgable(self)
    return false
end
function modifier_yondaime_yellow_flash.prototype.RemoveOnDeath(self)
    return true
end
function modifier_yondaime_yellow_flash.prototype.OnCreated(self, params)
    local ability = self:GetAbility()
    self.move_speed = ability:GetSpecialValueFor("move_speed")
    self.evasion = ability:GetSpecialValueFor("evasion")
end
function modifier_yondaime_yellow_flash.prototype.DeclareFunctions(self)
    return {MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE, MODIFIER_PROPERTY_EVASION_CONSTANT, MODIFIER_PROPERTY_IGNORE_MOVESPEED_LIMIT}
end
function modifier_yondaime_yellow_flash.prototype.GetModifierMoveSpeedBonus_Percentage(self)
    return self.move_speed
end
function modifier_yondaime_yellow_flash.prototype.GetModifierEvasion_Constant(self)
    return self.evasion
end
function modifier_yondaime_yellow_flash.prototype.GetModifierIgnoreMovespeedLimit(self)
    return 1
end
function modifier_yondaime_yellow_flash.prototype.GetEffectName(self)
    return "particles/units/heroes/yondaime/yondaime_yellow_flash.vpcf"
end
function modifier_yondaime_yellow_flash.prototype.GetEffectAttachType(self)
    return PATTACH_ABSORIGIN
end
modifier_yondaime_yellow_flash = __TS__Decorate(
    {registerModifier(nil)},
    modifier_yondaime_yellow_flash
)
____exports.modifier_yondaime_yellow_flash = modifier_yondaime_yellow_flash
return ____exports
