--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["5"] = 1,["6"] = 1,["7"] = 1,["8"] = 1,["9"] = 1,["10"] = 1,["11"] = 7,["12"] = 8,["13"] = 7,["14"] = 8,["15"] = 15,["16"] = 16,["17"] = 17,["18"] = 18,["19"] = 19,["20"] = 20,["21"] = 21,["22"] = 15,["23"] = 26,["24"] = 27,["25"] = 26,["26"] = 32,["27"] = 33,["28"] = 8,["30"] = 8,["32"] = 32,["33"] = 41,["34"] = 42,["35"] = 43,["36"] = 45,["39"] = 47,["40"] = 47,["41"] = 47,["42"] = 47,["43"] = 47,["44"] = 47,["45"] = 47,["46"] = 47,["47"] = 47,["48"] = 49,["49"] = 41,["50"] = 8,["52"] = 7,["54"] = 8,["56"] = 55,["57"] = 56,["58"] = 55,["59"] = 56,["60"] = 67,["61"] = 67,["62"] = 67,["63"] = 68,["64"] = 68,["65"] = 68,["66"] = 72,["67"] = 73,["68"] = 75,["69"] = 76,["70"] = 77,["71"] = 78,["72"] = 80,["75"] = 81,["76"] = 83,["77"] = 84,["80"] = 72,["81"] = 91,["82"] = 92,["85"] = 93,["86"] = 95,["87"] = 97,["88"] = 98,["90"] = 91,["91"] = 104,["92"] = 104,["93"] = 104,["94"] = 110,["95"] = 111,["96"] = 110,["97"] = 119,["98"] = 120,["99"] = 122,["100"] = 123,["103"] = 125,["104"] = 125,["105"] = 125,["106"] = 126,["107"] = 126,["108"] = 126,["109"] = 119,["110"] = 131,["111"] = 132,["112"] = 131,["113"] = 137,["114"] = 138,["115"] = 137,["116"] = 143,["117"] = 144,["118"] = 145,["119"] = 145,["121"] = 143,["122"] = 150,["123"] = 151,["124"] = 152,["125"] = 154,["126"] = 155,["127"] = 157,["128"] = 158,["129"] = 158,["130"] = 158,["131"] = 158,["132"] = 158,["133"] = 158,["134"] = 158,["135"] = 158,["136"] = 158,["137"] = 166,["138"] = 166,["139"] = 166,["140"] = 166,["141"] = 166,["142"] = 166,["143"] = 166,["144"] = 166,["145"] = 166,["146"] = 166,["147"] = 166,["149"] = 169,["150"] = 171,["151"] = 172,["152"] = 173,["153"] = 174,["154"] = 175,["156"] = 178,["157"] = 150,["158"] = 183,["159"] = 184,["160"] = 185,["161"] = 186,["162"] = 188,["163"] = 189,["164"] = 189,["165"] = 189,["166"] = 189,["167"] = 189,["168"] = 189,["169"] = 189,["170"] = 189,["171"] = 189,["172"] = 190,["173"] = 190,["174"] = 190,["175"] = 190,["176"] = 190,["177"] = 190,["178"] = 190,["179"] = 190,["180"] = 190,["181"] = 191,["182"] = 191,["183"] = 191,["184"] = 191,["185"] = 191,["186"] = 192,["187"] = 194,["188"] = 195,["189"] = 183,["190"] = 56,["192"] = 55,["194"] = 56,["196"] = 199,["197"] = 200,["198"] = 199,["199"] = 200,["201"] = 200,["202"] = 203,["203"] = 199,["204"] = 207,["205"] = 208,["206"] = 209,["207"] = 210,["208"] = 212,["209"] = 214,["210"] = 215,["211"] = 216,["213"] = 207,["214"] = 222,["215"] = 222,["216"] = 222,["217"] = 226,["218"] = 227,["219"] = 226,["220"] = 232,["221"] = 233,["222"] = 232,["223"] = 238,["224"] = 239,["225"] = 238,["226"] = 200,["228"] = 199,["230"] = 200,["232"] = 243,["233"] = 244,["234"] = 243,["235"] = 244,["236"] = 246,["237"] = 246,["238"] = 246,["239"] = 247,["240"] = 247,["241"] = 247,["242"] = 251,["243"] = 252,["244"] = 251,["245"] = 244,["247"] = 243,["249"] = 244});
local ____exports = {}
local ____dota_ts_adapter = require("lib.dota_ts_adapter")
local BaseAbility = ____dota_ts_adapter.BaseAbility
local BaseModifier = ____dota_ts_adapter.BaseModifier
local BaseModifierMotionHorizontal = ____dota_ts_adapter.BaseModifierMotionHorizontal
local registerAbility = ____dota_ts_adapter.registerAbility
local registerModifier = ____dota_ts_adapter.registerModifier
____exports.guy_dynamic_entry = __TS__Class()
local guy_dynamic_entry = ____exports.guy_dynamic_entry
guy_dynamic_entry.name = "guy_dynamic_entry"
__TS__ClassExtends(guy_dynamic_entry, BaseAbility)
function guy_dynamic_entry.prototype.Precache(self, context)
    PrecacheResource("particle", "particles/units/heroes/guy/guy_dynamic_entry_impact_base.vpcf", context)
    PrecacheResource("particle", "particles/units/heroes/guy/guy_dynamic_entry_six_gates_impact_base.vpcf", context)
    PrecacheResource("particle", "particles/units/heroes/guy/guy_dynamic_entry_armor_debuff_base.vpcf", context)
    PrecacheResource("particle", "particles/units/heroes/guy/guy_dynamic_entry_armor_debuff_gates.vpcf", context)
    PrecacheResource("soundfile", "soundevents/heroes/guy/game_sounds_guy.vsndevts", context)
    PrecacheResource("soundfile", "soundevents/heroes/guy/game_sounds_vo_guy.vsndevts", context)
end
function guy_dynamic_entry.prototype.GetAbilityTextureName(self)
    return ((self:GetCaster() and self:GetCaster():HasModifier("modifier_guy_seventh_gate")) and "guy_dynamic_entry_gates") or "guy_dynamic_entry"
end
function guy_dynamic_entry.prototype.GetCastRange(self, location, target)
    if self:GetCaster():HasModifier("modifier_guy_seventh_gate") then
        return (BaseAbility.prototype.GetCastRange(self, location, target) + self:GetCaster():FindTalentValue("special_bonus_guy_5")) + self:GetSpecialValueFor("castrange_ult_bonus")
    else
        return BaseAbility.prototype.GetCastRange(self, location, target) + self:GetCaster():FindTalentValue("special_bonus_guy_5")
    end
end
function guy_dynamic_entry.prototype.OnSpellStart(self)
    local caster = self:GetCaster()
    local target = self:GetCursorTarget()
    if __TS__OptionalMethodCall(target, "TriggerSpellAbsorb", false, self) then
        return
    end
    caster:AddNewModifier(
        caster,
        self,
        "modifier_guy_dynamic_entry",
        {
            duration = -1,
            target = __TS__OptionalMethodCall(target, "entindex", false)
        }
    );
    ((caster:HasModifier("modifier_guy_seventh_gate") and (function() return EmitSoundOn("VO_Hero_Guy.DynamicEntryGate.Cast", caster) end)) or (function() return EmitSoundOn("VO_Hero_Guy.DynamicEntry.Cast", caster) end))()
end
guy_dynamic_entry = __TS__Decorate(
    {
        registerAbility(nil)
    },
    guy_dynamic_entry
)
____exports.modifier_guy_dynamic_entry = __TS__Class()
local modifier_guy_dynamic_entry = ____exports.modifier_guy_dynamic_entry
modifier_guy_dynamic_entry.name = "modifier_guy_dynamic_entry"
__TS__ClassExtends(modifier_guy_dynamic_entry, BaseModifierMotionHorizontal)
function modifier_guy_dynamic_entry.prototype.IsPurgable(self)
    return false
end
function modifier_guy_dynamic_entry.prototype.RemoveOnDeath(self)
    return true
end
function modifier_guy_dynamic_entry.prototype.OnCreated(self, params)
    local ability = self:GetAbility()
    self.duration = ability:GetSpecialValueFor("duration")
    self.speed = 1900
    self.damage = ability:GetSpecialValueFor("damage")
    self.stop_distance = ability:GetSpecialValueFor("stop_distance")
    if not IsServer() then
        return
    end
    self.target = EntIndexToHScript(params.target)
    if not self:ApplyHorizontalMotionController() then
        self:Destroy()
        return
    end
end
function modifier_guy_dynamic_entry.prototype.OnDestroy(self)
    if not IsServer() then
        return
    end
    local parent = self:GetParent()
    parent:RemoveHorizontalMotionController(self)
    if (self.target and (not self.target:IsNull())) and self.target:HasModifier("modifier_guy_dynamic_entry_target") then
        self.target:RemoveModifierByName("modifier_guy_dynamic_entry_target")
    end
end
function modifier_guy_dynamic_entry.prototype.DeclareFunctions(self)
    return {MODIFIER_PROPERTY_OVERRIDE_ANIMATION}
end
function modifier_guy_dynamic_entry.prototype.CheckState(self)
    return {[MODIFIER_STATE_NO_UNIT_COLLISION] = true, [MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY] = true}
end
function modifier_guy_dynamic_entry.prototype.UpdateHorizontalMotion(self, parent, dt)
    local direction = (self.target:GetAbsOrigin() - parent:GetAbsOrigin()):Normalized()
    self:CheckConditions()
    if self:CheckDistance() then
        return
    end
    parent:FaceTowards(
        self.target:GetAbsOrigin()
    )
    parent:SetAbsOrigin(
        parent:GetAbsOrigin() + ((self.speed * direction) * dt)
    )
end
function modifier_guy_dynamic_entry.prototype.OnHorizontalMotionInterrupted(self)
    self:Destroy()
end
function modifier_guy_dynamic_entry.prototype.GetOverrideAnimation(self)
    return ACT_DOTA_CHANNEL_ABILITY_1
end
function modifier_guy_dynamic_entry.prototype.CheckConditions(self)
    local parent = self:GetParent()
    if (((parent:IsStunned() or parent:IsHexed()) or parent:IsRooted()) or __TS__OptionalMethodCall(self.target, "IsNull", false)) or (not __TS__OptionalMethodCall(self.target, "IsAlive", false)) then
        self:Destroy()
    end
end
function modifier_guy_dynamic_entry.prototype.CheckDistance(self)
    local parent = self:GetParent()
    local distance = (parent:GetAbsOrigin() - self.target:GetAbsOrigin()):Length2D()
    if distance <= 128 then
        local ability = self:GetAbility()
        if not __TS__OptionalMethodCall(self.target, "IsMagicImmune", false) then
            ApplyDamage(
                {
                    attacker = parent,
                    victim = self.target,
                    damage = self.damage,
                    damage_type = self:GetAbility():GetAbilityDamageType(),
                    ability = self:GetAbility()
                }
            )
            __TS__OptionalMethodCall(
                self.target,
                "AddNewModifier",
                false,
                parent,
                ability,
                "modifier_guy_dynamic_entry_debuff",
                {
                    duration = self.duration * (1 - self.target:GetStatusResistance())
                }
            )
        end
        self:ShowEffects()
        self:Destroy()
        return true
    elseif distance > self.stop_distance then
        self:Destroy()
        return true
    end
    return false
end
function modifier_guy_dynamic_entry.prototype.ShowEffects(self)
    local parent = self:GetParent()
    local gates_open = parent:HasModifier("modifier_guy_seventh_gate")
    local impact_particle = (gates_open and "particles/units/heroes/guy/guy_dynamic_entry_six_gates_impact_base.vpcf") or "particles/units/heroes/guy/guy_dynamic_entry_impact_base.vpcf"
    local impact_fx = ParticleManager:CreateParticle(impact_particle, PATTACH_ABSORIGIN_FOLLOW, self.target)
    ParticleManager:SetParticleControlEnt(
        impact_fx,
        1,
        self.target,
        PATTACH_ABSORIGIN,
        "attach_hitloc",
        self.target:GetAbsOrigin(),
        true
    )
    ParticleManager:SetParticleControlEnt(
        impact_fx,
        3,
        self.target,
        PATTACH_ABSORIGIN,
        "attach_hitloc",
        self.target:GetAbsOrigin(),
        true
    )
    ParticleManager:SetParticleControl(
        impact_fx,
        6,
        Vector(150, 1, 1)
    )
    ParticleManager:ReleaseParticleIndex(impact_fx);
    ((gates_open and (function() return EmitSoundOn("Hero_Guy.DynamicEntryGate.Impact", self.target) end)) or (function() return EmitSoundOn("Hero_Guy.DynamicEntry.Impact", self.target) end))()
    EmitSoundOn("Hero_Guy.DynamicEntry.ImpactLayer", self.target)
end
modifier_guy_dynamic_entry = __TS__Decorate(
    {
        registerModifier(nil)
    },
    modifier_guy_dynamic_entry
)
____exports.modifier_guy_dynamic_entry_debuff = __TS__Class()
local modifier_guy_dynamic_entry_debuff = ____exports.modifier_guy_dynamic_entry_debuff
modifier_guy_dynamic_entry_debuff.name = "modifier_guy_dynamic_entry_debuff"
__TS__ClassExtends(modifier_guy_dynamic_entry_debuff, BaseModifier)
function modifier_guy_dynamic_entry_debuff.prototype.____constructor(self, ...)
    BaseModifier.prototype.____constructor(self, ...)
    self.effect_name = "particles/units/heroes/guy/guy_dynamic_entry_armor_debuff_base.vpcf"
end
function modifier_guy_dynamic_entry_debuff.prototype.OnCreated(self, params)
    local ability = self:GetAbility()
    local caster = self:GetCaster()
    local gates_open = __TS__OptionalMethodCall(caster, "HasModifier", false, "modifier_guy_seventh_gate")
    self.armor_reduction = -ability:GetSpecialValueFor("armor_reduction")
    if gates_open then
        self.armor_reduction = self.armor_reduction - ability:GetSpecialValueFor("armor_ult_bonus")
        self.effect_name = "particles/units/heroes/guy/guy_dynamic_entry_armor_debuff_gates.vpcf"
    end
end
function modifier_guy_dynamic_entry_debuff.prototype.DeclareFunctions(self)
    return {MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS}
end
function modifier_guy_dynamic_entry_debuff.prototype.GetModifierPhysicalArmorBonus(self)
    return self.armor_reduction
end
function modifier_guy_dynamic_entry_debuff.prototype.GetEffectName(self)
    return self.effect_name
end
function modifier_guy_dynamic_entry_debuff.prototype.GetEffectAttachType(self)
    return PATTACH_OVERHEAD_FOLLOW
end
modifier_guy_dynamic_entry_debuff = __TS__Decorate(
    {
        registerModifier(nil)
    },
    modifier_guy_dynamic_entry_debuff
)
____exports.modifier_guy_dynamic_entry_target = __TS__Class()
local modifier_guy_dynamic_entry_target = ____exports.modifier_guy_dynamic_entry_target
modifier_guy_dynamic_entry_target.name = "modifier_guy_dynamic_entry_target"
__TS__ClassExtends(modifier_guy_dynamic_entry_target, BaseModifier)
function modifier_guy_dynamic_entry_target.prototype.IsHidden(self)
    return true
end
function modifier_guy_dynamic_entry_target.prototype.IsPurgable(self)
    return false
end
function modifier_guy_dynamic_entry_target.prototype.CheckState(self)
    return {[MODIFIER_STATE_PROVIDES_VISION] = true}
end
modifier_guy_dynamic_entry_target = __TS__Decorate(
    {
        registerModifier(nil)
    },
    modifier_guy_dynamic_entry_target
)
return ____exports
