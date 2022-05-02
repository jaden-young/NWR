local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__Decorate = ____lualib.__TS__Decorate
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["8"] = 1,["9"] = 1,["10"] = 1,["11"] = 1,["12"] = 1,["13"] = 3,["14"] = 4,["15"] = 3,["16"] = 4,["17"] = 6,["18"] = 8,["19"] = 9,["20"] = 9,["21"] = 9,["23"] = 10,["24"] = 11,["25"] = 12,["27"] = 6,["28"] = 16,["29"] = 17,["30"] = 16,["31"] = 4,["32"] = 3,["33"] = 4,["35"] = 4,["36"] = 21,["37"] = 22,["38"] = 21,["39"] = 22,["40"] = 24,["41"] = 25,["42"] = 24,["43"] = 28,["44"] = 29,["45"] = 28,["46"] = 32,["47"] = 33,["48"] = 32,["49"] = 36,["50"] = 37,["51"] = 36,["52"] = 41,["53"] = 42,["54"] = 41,["55"] = 45,["56"] = 46,["59"] = 47,["62"] = 50,["63"] = 51,["64"] = 52,["65"] = 53,["66"] = 54,["67"] = 55,["69"] = 45,["70"] = 22,["71"] = 21,["72"] = 22,["74"] = 22,["75"] = 60,["76"] = 61,["77"] = 60,["78"] = 61,["79"] = 63,["80"] = 64,["81"] = 63,["82"] = 67,["83"] = 68,["84"] = 67,["85"] = 71,["86"] = 72,["87"] = 71,["88"] = 75,["89"] = 76,["90"] = 75,["91"] = 79,["92"] = 80,["93"] = 81,["94"] = 82,["97"] = 83,["100"] = 84,["101"] = 85,["102"] = 86,["103"] = 87,["104"] = 88,["107"] = 89,["108"] = 90,["109"] = 91,["110"] = 92,["111"] = 93,["112"] = 94,["114"] = 96,["115"] = 97,["118"] = 100,["119"] = 101,["121"] = 79,["122"] = 105,["123"] = 106,["126"] = 107,["127"] = 108,["128"] = 109,["131"] = 110,["132"] = 111,["133"] = 113,["134"] = 114,["137"] = 115,["138"] = 116,["140"] = 118,["142"] = 105,["143"] = 61,["144"] = 60,["145"] = 61,["147"] = 61,["148"] = 123,["149"] = 124,["150"] = 123,["151"] = 124,["153"] = 124,["154"] = 126,["155"] = 127,["156"] = 123,["157"] = 129,["158"] = 130,["159"] = 129,["160"] = 133,["161"] = 134,["162"] = 133,["163"] = 137,["164"] = 138,["165"] = 137,["166"] = 141,["167"] = 142,["168"] = 143,["171"] = 144,["172"] = 145,["173"] = 141,["174"] = 148,["175"] = 149,["176"] = 148,["177"] = 152,["178"] = 153,["179"] = 152,["180"] = 157,["181"] = 158,["182"] = 157,["183"] = 161,["184"] = 162,["185"] = 161,["186"] = 124,["187"] = 123,["188"] = 124,["190"] = 124});
local ____exports = {}
local ____dota_ts_adapter = require("lib.dota_ts_adapter")
local BaseAbility = ____dota_ts_adapter.BaseAbility
local BaseModifier = ____dota_ts_adapter.BaseModifier
local registerAbility = ____dota_ts_adapter.registerAbility
local registerModifier = ____dota_ts_adapter.registerModifier
____exports.madara_innate_passive = __TS__Class()
local madara_innate_passive = ____exports.madara_innate_passive
madara_innate_passive.name = "madara_innate_passive"
__TS__ClassExtends(madara_innate_passive, BaseAbility)
function madara_innate_passive.prototype.OnUpgrade(self)
    local caster = self:GetCaster()
    local ____caster_FindModifierByName_result_ForceRefresh_result_0 = caster:FindModifierByName(self:GetIntrinsicModifierName())
    if ____caster_FindModifierByName_result_ForceRefresh_result_0 ~= nil then
        ____caster_FindModifierByName_result_ForceRefresh_result_0 = ____caster_FindModifierByName_result_ForceRefresh_result_0:ForceRefresh()
    end
    local counter_modifier = caster:FindModifierByName("modifier_madara_innate_passive_buff_counter")
    if counter_modifier then
        counter_modifier:UpdateNumbers()
    end
end
function madara_innate_passive.prototype.GetIntrinsicModifierName(self)
    return "modifier_madara_innate_passive_intrinsic"
end
madara_innate_passive = __TS__Decorate(
    {registerAbility(nil)},
    madara_innate_passive
)
____exports.madara_innate_passive = madara_innate_passive
____exports.modifier_madara_innate_passive_intrinsic = __TS__Class()
local modifier_madara_innate_passive_intrinsic = ____exports.modifier_madara_innate_passive_intrinsic
modifier_madara_innate_passive_intrinsic.name = "modifier_madara_innate_passive_intrinsic"
__TS__ClassExtends(modifier_madara_innate_passive_intrinsic, BaseModifier)
function modifier_madara_innate_passive_intrinsic.prototype.IsHidden(self)
    return true
end
function modifier_madara_innate_passive_intrinsic.prototype.IsDebuff(self)
    return false
end
function modifier_madara_innate_passive_intrinsic.prototype.IsPurgable(self)
    return false
end
function modifier_madara_innate_passive_intrinsic.prototype.IsPermanent(self)
    return false
end
function modifier_madara_innate_passive_intrinsic.prototype.DeclareFunctions(self)
    return {MODIFIER_EVENT_ON_ATTACK_LANDED}
end
function modifier_madara_innate_passive_intrinsic.prototype.OnAttackLanded(self, event)
    if event.target ~= self:GetParent() then
        return
    end
    if event.attacker:GetTeam() == self:GetParent():GetTeam() then
        return
    end
    local parent = self:GetParent()
    local ability = self:GetAbility()
    if ability then
        local stack_duration = ability:GetSpecialValueFor("stack_duration_base") + (ability:GetSpecialValueFor("stack_duration_per_level_bonus") + (ability:GetLevel() - 1))
        print(stack_duration)
        parent:AddNewModifier(parent, ability, "modifier_madara_innate_passive_buff", {duration = stack_duration})
    end
end
modifier_madara_innate_passive_intrinsic = __TS__Decorate(
    {registerModifier(nil)},
    modifier_madara_innate_passive_intrinsic
)
____exports.modifier_madara_innate_passive_intrinsic = modifier_madara_innate_passive_intrinsic
____exports.modifier_madara_innate_passive_buff = __TS__Class()
local modifier_madara_innate_passive_buff = ____exports.modifier_madara_innate_passive_buff
modifier_madara_innate_passive_buff.name = "modifier_madara_innate_passive_buff"
__TS__ClassExtends(modifier_madara_innate_passive_buff, BaseModifier)
function modifier_madara_innate_passive_buff.prototype.IsHidden(self)
    return true
end
function modifier_madara_innate_passive_buff.prototype.IsDebuff(self)
    return false
end
function modifier_madara_innate_passive_buff.prototype.IsPurgable(self)
    return false
end
function modifier_madara_innate_passive_buff.prototype.GetAttributes(self)
    return MODIFIER_ATTRIBUTE_MULTIPLE
end
function modifier_madara_innate_passive_buff.prototype.OnCreated(self, params)
    local parent = self:GetParent()
    local ability = self:GetAbility()
    if not IsServer() then
        return
    end
    if not ability then
        return
    end
    local max_stacks = ability:GetSpecialValueFor("max_stacks_base") + (ability:GetSpecialValueFor("max_stacks_per_level_bonus") + (ability:GetLevel() - 1))
    local stack_duration = ability:GetSpecialValueFor("stack_duration_base") + (ability:GetSpecialValueFor("stack_duration_per_level_bonus") + (ability:GetLevel() - 1))
    if parent:HasModifier("modifier_madara_innate_passive_buff_counter") then
        local counter_modifier = parent:FindModifierByName("modifier_madara_innate_passive_buff_counter")
        if not counter_modifier then
            return
        end
        local current_stacks = counter_modifier:GetStackCount()
        if current_stacks == max_stacks then
            local buff_modifiers = parent:FindAllModifiersByName("modifier_madara_innate_passive_buff")
            buff_modifiers[1]:Destroy()
            counter_modifier:SetDuration(stack_duration, true)
            counter_modifier:IncrementStackCount()
        else
            counter_modifier:IncrementStackCount()
            counter_modifier:SetDuration(stack_duration, true)
        end
    else
        local new_counter_modifier = parent:AddNewModifier(parent, ability, "modifier_madara_innate_passive_buff_counter", {duration = stack_duration})
        new_counter_modifier:SetStackCount(1)
    end
end
function modifier_madara_innate_passive_buff.prototype.OnDestroy(self)
    if not IsServer() then
        return
    end
    local parent = self:GetParent()
    local ability = self:GetAbility()
    if not ability then
        return
    end
    local max_stacks = ability:GetSpecialValueFor("max_stacks_base") + (ability:GetSpecialValueFor("max_stacks_per_level_bonus") + (ability:GetLevel() - 1))
    local stack_duration = ability:GetSpecialValueFor("stack_duration_base") + (ability:GetSpecialValueFor("stack_duration_per_level_bonus") + (ability:GetLevel() - 1))
    local counter_modifier = parent:FindModifierByName("modifier_madara_innate_passive_buff_counter")
    if not counter_modifier then
        return
    end
    if counter_modifier:GetStackCount() == 1 then
        parent:RemoveModifierByName("modifier_madara_innate_passive_buff_counter")
    else
        counter_modifier:DecrementStackCount()
    end
end
modifier_madara_innate_passive_buff = __TS__Decorate(
    {registerModifier(nil)},
    modifier_madara_innate_passive_buff
)
____exports.modifier_madara_innate_passive_buff = modifier_madara_innate_passive_buff
____exports.modifier_madara_innate_passive_buff_counter = __TS__Class()
local modifier_madara_innate_passive_buff_counter = ____exports.modifier_madara_innate_passive_buff_counter
modifier_madara_innate_passive_buff_counter.name = "modifier_madara_innate_passive_buff_counter"
__TS__ClassExtends(modifier_madara_innate_passive_buff_counter, BaseModifier)
function modifier_madara_innate_passive_buff_counter.prototype.____constructor(self, ...)
    BaseModifier.prototype.____constructor(self, ...)
    self.spell_damage_bonus_per_stack = 0
    self.health_regen_per_stack = 0
end
function modifier_madara_innate_passive_buff_counter.prototype.IsHidden(self)
    return false
end
function modifier_madara_innate_passive_buff_counter.prototype.IsDebuff(self)
    return false
end
function modifier_madara_innate_passive_buff_counter.prototype.IsPurgable(self)
    return false
end
function modifier_madara_innate_passive_buff_counter.prototype.UpdateNumbers(self)
    local ability = self:GetAbility()
    if not ability then
        return
    end
    self.spell_damage_bonus_per_stack = ability:GetSpecialValueFor("spell_damage_bonus_per_stack")
    self.health_regen_per_stack = ability:GetSpecialValueFor("health_regen_per_stack_base") + ability:GetSpecialValueFor("health_regen_per_stack_per_level_bonus") * (ability:GetLevel() - 1)
end
function modifier_madara_innate_passive_buff_counter.prototype.OnCreated(self)
    self:UpdateNumbers()
end
function modifier_madara_innate_passive_buff_counter.prototype.DeclareFunctions(self)
    return {MODIFIER_PROPERTY_HEALTH_REGEN_CONSTANT, MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE}
end
function modifier_madara_innate_passive_buff_counter.prototype.GetModifierConstantHealthRegen(self)
    return self:GetStackCount() * self.health_regen_per_stack
end
function modifier_madara_innate_passive_buff_counter.prototype.GetModifierSpellAmplify_Percentage(self)
    return self:GetStackCount() * self.spell_damage_bonus_per_stack
end
modifier_madara_innate_passive_buff_counter = __TS__Decorate(
    {registerModifier(nil)},
    modifier_madara_innate_passive_buff_counter
)
____exports.modifier_madara_innate_passive_buff_counter = modifier_madara_innate_passive_buff_counter
return ____exports
