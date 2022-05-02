local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__Decorate = ____lualib.__TS__Decorate
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["8"] = 1,["9"] = 1,["10"] = 1,["11"] = 1,["12"] = 1,["13"] = 3,["14"] = 4,["15"] = 3,["16"] = 4,["17"] = 6,["18"] = 8,["19"] = 8,["20"] = 8,["22"] = 6,["23"] = 11,["24"] = 12,["25"] = 11,["26"] = 4,["27"] = 3,["28"] = 4,["30"] = 4,["31"] = 16,["32"] = 17,["33"] = 16,["34"] = 17,["36"] = 17,["37"] = 19,["38"] = 20,["39"] = 16,["40"] = 22,["41"] = 23,["42"] = 22,["43"] = 26,["44"] = 27,["45"] = 26,["46"] = 30,["47"] = 31,["48"] = 30,["49"] = 34,["50"] = 35,["51"] = 34,["52"] = 39,["53"] = 40,["54"] = 41,["55"] = 42,["56"] = 43,["58"] = 39,["59"] = 47,["60"] = 48,["61"] = 49,["62"] = 50,["63"] = 51,["64"] = 52,["65"] = 53,["67"] = 47,["68"] = 59,["69"] = 60,["70"] = 59,["71"] = 63,["72"] = 64,["73"] = 65,["74"] = 67,["75"] = 63,["76"] = 17,["77"] = 16,["78"] = 17,["80"] = 17});
local ____exports = {}
local ____dota_ts_adapter = require("lib.dota_ts_adapter")
local BaseAbility = ____dota_ts_adapter.BaseAbility
local BaseModifier = ____dota_ts_adapter.BaseModifier
local registerAbility = ____dota_ts_adapter.registerAbility
local registerModifier = ____dota_ts_adapter.registerModifier
____exports.yondaime_innate_passive = __TS__Class()
local yondaime_innate_passive = ____exports.yondaime_innate_passive
yondaime_innate_passive.name = "yondaime_innate_passive"
__TS__ClassExtends(yondaime_innate_passive, BaseAbility)
function yondaime_innate_passive.prototype.OnUpgrade(self)
    local ____table_GetCaster_result_FindModifierByName_result_ForceRefresh_result_0 = self:GetCaster():FindModifierByName(self:GetIntrinsicModifierName())
    if ____table_GetCaster_result_FindModifierByName_result_ForceRefresh_result_0 ~= nil then
        ____table_GetCaster_result_FindModifierByName_result_ForceRefresh_result_0 = ____table_GetCaster_result_FindModifierByName_result_ForceRefresh_result_0:ForceRefresh()
    end
end
function yondaime_innate_passive.prototype.GetIntrinsicModifierName(self)
    return "modifier_yondaime_innate_passive_intrinsic"
end
yondaime_innate_passive = __TS__Decorate(
    {registerAbility(nil)},
    yondaime_innate_passive
)
____exports.yondaime_innate_passive = yondaime_innate_passive
____exports.modifier_yondaime_innate_passive_intrinsic = __TS__Class()
local modifier_yondaime_innate_passive_intrinsic = ____exports.modifier_yondaime_innate_passive_intrinsic
modifier_yondaime_innate_passive_intrinsic.name = "modifier_yondaime_innate_passive_intrinsic"
__TS__ClassExtends(modifier_yondaime_innate_passive_intrinsic, BaseModifier)
function modifier_yondaime_innate_passive_intrinsic.prototype.____constructor(self, ...)
    BaseModifier.prototype.____constructor(self, ...)
    self.move_speed_percentage = 0
    self.attack_damage_move_speed_percentage = 0
end
function modifier_yondaime_innate_passive_intrinsic.prototype.IsHidden(self)
    return false
end
function modifier_yondaime_innate_passive_intrinsic.prototype.IsPermanent(self)
    return true
end
function modifier_yondaime_innate_passive_intrinsic.prototype.IsPurgable(self)
    return false
end
function modifier_yondaime_innate_passive_intrinsic.prototype.DeclareFunctions(self)
    return {MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE, MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE}
end
function modifier_yondaime_innate_passive_intrinsic.prototype.OnCreated(self, params)
    local ability = self:GetAbility()
    if ability then
        self.move_speed_percentage = ability:GetSpecialValueFor("move_speed_percentage_base") + ability:GetSpecialValueFor("move_speed_percentage_per_level_bonus") * (ability:GetLevel() - 1)
        self.attack_damage_move_speed_percentage = ability:GetSpecialValueFor("attack_damage_move_speed_percentage_base") + ability:GetSpecialValueFor("attack_damage_move_speed_percentage_per_level_bonus") * (ability:GetLevel() - 1)
    end
end
function modifier_yondaime_innate_passive_intrinsic.prototype.OnRefresh(self, params)
    local ability = self:GetAbility()
    if ability then
        self.move_speed_percentage = ability:GetSpecialValueFor("move_speed_percentage_base") + ability:GetSpecialValueFor("move_speed_percentage_per_level_bonus") * (ability:GetLevel() - 1)
        self.attack_damage_move_speed_percentage = ability:GetSpecialValueFor("attack_damage_move_speed_percentage_base") + ability:GetSpecialValueFor("attack_damage_move_speed_percentage_per_level_bonus") * (ability:GetLevel() - 1)
        print(self.move_speed_percentage)
        print(self.attack_damage_move_speed_percentage)
    end
end
function modifier_yondaime_innate_passive_intrinsic.prototype.GetModifierMoveSpeedBonus_Percentage(self)
    return self.move_speed_percentage
end
function modifier_yondaime_innate_passive_intrinsic.prototype.GetModifierPreAttack_BonusDamage(self)
    local bonus_attack_damage = self.attack_damage_move_speed_percentage * self:GetParent():GetIdealSpeed() * 0.01
    self:SetStackCount(bonus_attack_damage)
    return bonus_attack_damage
end
modifier_yondaime_innate_passive_intrinsic = __TS__Decorate(
    {registerModifier(nil)},
    modifier_yondaime_innate_passive_intrinsic
)
____exports.modifier_yondaime_innate_passive_intrinsic = modifier_yondaime_innate_passive_intrinsic
return ____exports
