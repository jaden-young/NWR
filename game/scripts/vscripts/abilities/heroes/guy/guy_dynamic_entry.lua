local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__Decorate = ____lualib.__TS__Decorate
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["8"] = 1,["9"] = 1,["10"] = 1,["11"] = 1,["12"] = 1,["13"] = 1,["14"] = 7,["15"] = 8,["16"] = 7,["17"] = 8,["18"] = 15,["19"] = 16,["20"] = 17,["21"] = 18,["22"] = 19,["23"] = 20,["24"] = 21,["25"] = 15,["26"] = 26,["27"] = 27,["28"] = 26,["29"] = 32,["30"] = 33,["31"] = 8,["33"] = 8,["35"] = 32,["36"] = 42,["37"] = 43,["38"] = 43,["39"] = 43,["40"] = 43,["41"] = 44,["42"] = 42,["43"] = 50,["44"] = 51,["45"] = 52,["46"] = 54,["47"] = 54,["48"] = 54,["50"] = 54,["53"] = 56,["54"] = 56,["55"] = 56,["56"] = 56,["57"] = 56,["58"] = 56,["59"] = 56,["60"] = 56,["62"] = 56,["63"] = 56,["64"] = 56,["65"] = 56,["66"] = 56,["67"] = 56,["68"] = 56,["69"] = 58,["70"] = 58,["71"] = 59,["73"] = 60,["75"] = 50,["76"] = 8,["77"] = 7,["78"] = 8,["80"] = 8,["81"] = 64,["82"] = 65,["83"] = 64,["84"] = 65,["85"] = 76,["86"] = 76,["87"] = 76,["88"] = 77,["89"] = 77,["90"] = 77,["91"] = 81,["92"] = 82,["93"] = 84,["94"] = 85,["95"] = 86,["96"] = 87,["97"] = 89,["100"] = 90,["101"] = 92,["102"] = 93,["105"] = 81,["106"] = 100,["107"] = 101,["110"] = 102,["111"] = 104,["112"] = 106,["113"] = 107,["115"] = 100,["116"] = 113,["117"] = 113,["118"] = 113,["119"] = 119,["120"] = 120,["121"] = 119,["122"] = 128,["123"] = 129,["124"] = 131,["125"] = 132,["128"] = 134,["129"] = 135,["130"] = 128,["131"] = 140,["132"] = 141,["133"] = 140,["134"] = 146,["135"] = 147,["136"] = 146,["137"] = 152,["138"] = 153,["139"] = 154,["141"] = 154,["142"] = 154,["143"] = 154,["145"] = 154,["147"] = 154,["149"] = 154,["150"] = 154,["151"] = 154,["153"] = 154,["155"] = 154,["156"] = 154,["158"] = 152,["159"] = 159,["160"] = 160,["161"] = 161,["162"] = 163,["163"] = 164,["164"] = 166,["165"] = 166,["166"] = 166,["168"] = 166,["169"] = 167,["170"] = 167,["171"] = 167,["172"] = 167,["173"] = 167,["174"] = 167,["175"] = 167,["176"] = 175,["177"] = 175,["178"] = 175,["179"] = 175,["180"] = 175,["181"] = 175,["182"] = 175,["183"] = 175,["186"] = 178,["187"] = 180,["188"] = 181,["189"] = 182,["190"] = 183,["191"] = 184,["193"] = 187,["194"] = 159,["195"] = 192,["196"] = 193,["197"] = 194,["198"] = 195,["199"] = 197,["200"] = 198,["201"] = 198,["202"] = 198,["203"] = 198,["204"] = 198,["205"] = 198,["206"] = 198,["207"] = 198,["208"] = 198,["209"] = 199,["210"] = 199,["211"] = 199,["212"] = 199,["213"] = 199,["214"] = 199,["215"] = 199,["216"] = 199,["217"] = 199,["218"] = 200,["219"] = 200,["220"] = 200,["221"] = 200,["222"] = 200,["223"] = 201,["224"] = 203,["225"] = 203,["226"] = 203,["228"] = 203,["230"] = 192,["231"] = 65,["232"] = 64,["233"] = 65,["235"] = 65,["236"] = 208,["237"] = 209,["238"] = 208,["239"] = 209,["241"] = 209,["242"] = 212,["243"] = 208,["244"] = 216,["245"] = 217,["246"] = 218,["247"] = 219,["248"] = 219,["249"] = 219,["251"] = 219,["252"] = 221,["253"] = 223,["254"] = 224,["255"] = 225,["257"] = 216,["258"] = 231,["259"] = 231,["260"] = 231,["261"] = 235,["262"] = 236,["263"] = 235,["264"] = 241,["265"] = 242,["266"] = 241,["267"] = 247,["268"] = 248,["269"] = 247,["270"] = 209,["271"] = 208,["272"] = 209,["274"] = 209,["275"] = 252,["276"] = 253,["277"] = 252,["278"] = 253,["279"] = 255,["280"] = 255,["281"] = 255,["282"] = 256,["283"] = 256,["284"] = 256,["285"] = 260,["286"] = 261,["287"] = 260,["288"] = 253,["289"] = 252,["290"] = 253,["292"] = 253});
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
    return self:GetCaster() and self:GetCaster():HasModifier("modifier_guy_seventh_gate") and "guy_dynamic_entry_gates" or "guy_dynamic_entry"
end
function guy_dynamic_entry.prototype.GetCastRange(self, location, target)
    if self:GetCaster():HasModifier("modifier_guy_seventh_gate") then
        return BaseAbility.prototype.GetCastRange(self, location, target) + self:GetCaster():FindTalentValue("special_bonus_guy_5") + self:GetSpecialValueFor("castrange_ult_bonus")
    else
        return BaseAbility.prototype.GetCastRange(self, location, target) + self:GetCaster():FindTalentValue("special_bonus_guy_5")
    end
end
function guy_dynamic_entry.prototype.OnAbilityPhaseStart(self)
    EmitSoundOn(
        "Hero_Guy.DynamicEntry.Cast",
        self:GetCaster()
    )
    return true
end
function guy_dynamic_entry.prototype.OnSpellStart(self)
    local caster = self:GetCaster()
    local target = self:GetCursorTarget()
    local ____target_TriggerSpellAbsorb_result_0 = target
    if ____target_TriggerSpellAbsorb_result_0 ~= nil then
        ____target_TriggerSpellAbsorb_result_0 = ____target_TriggerSpellAbsorb_result_0:TriggerSpellAbsorb(self)
    end
    if ____target_TriggerSpellAbsorb_result_0 then
        return
    end
    local ____caster_7 = caster
    local ____caster_AddNewModifier_8 = caster.AddNewModifier
    local ____caster_5 = caster
    local ____self_6 = self
    local ____temp_4 = -1
    local ____target_entindex_result_2 = target
    if ____target_entindex_result_2 ~= nil then
        ____target_entindex_result_2 = ____target_entindex_result_2:entindex()
    end
    ____caster_AddNewModifier_8(
        ____caster_7,
        ____caster_5,
        ____self_6,
        "modifier_guy_dynamic_entry",
        {duration = ____temp_4, target = ____target_entindex_result_2}
    )
    local ____caster_HasModifier_result_9
    if caster:HasModifier("modifier_guy_seventh_gate") then
        ____caster_HasModifier_result_9 = EmitSoundOn("VO_Hero_Guy.DynamicEntryGate.Cast", caster)
    else
        ____caster_HasModifier_result_9 = EmitSoundOn("VO_Hero_Guy.DynamicEntry.Cast", caster)
    end
end
guy_dynamic_entry = __TS__Decorate(
    {registerAbility(nil)},
    guy_dynamic_entry
)
____exports.guy_dynamic_entry = guy_dynamic_entry
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
    self.speed = ability:GetSpecialValueFor("speed")
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
    if self.target and not self.target:IsNull() and self.target:HasModifier("modifier_guy_dynamic_entry_target") then
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
    parent:FaceTowards(self.target:GetAbsOrigin())
    parent:SetAbsOrigin(parent:GetAbsOrigin() + self.speed * direction * dt)
end
function modifier_guy_dynamic_entry.prototype.OnHorizontalMotionInterrupted(self)
    self:Destroy()
end
function modifier_guy_dynamic_entry.prototype.GetOverrideAnimation(self)
    return ACT_DOTA_CHANNEL_ABILITY_1
end
function modifier_guy_dynamic_entry.prototype.CheckConditions(self)
    local parent = self:GetParent()
    local ____temp_12 = parent:IsStunned() or parent:IsHexed() or parent:IsRooted()
    if not ____temp_12 then
        local ____table_target_IsNull_result_10 = self.target
        if ____table_target_IsNull_result_10 ~= nil then
            ____table_target_IsNull_result_10 = ____table_target_IsNull_result_10:IsNull()
        end
        ____temp_12 = ____table_target_IsNull_result_10
    end
    local ____temp_12_15 = ____temp_12
    if not ____temp_12_15 then
        local ____table_target_IsAlive_result_13 = self.target
        if ____table_target_IsAlive_result_13 ~= nil then
            ____table_target_IsAlive_result_13 = ____table_target_IsAlive_result_13:IsAlive()
        end
        ____temp_12_15 = not ____table_target_IsAlive_result_13
    end
    if ____temp_12_15 then
        self:Destroy()
    end
end
function modifier_guy_dynamic_entry.prototype.CheckDistance(self)
    local parent = self:GetParent()
    local distance = (parent:GetAbsOrigin() - self.target:GetAbsOrigin()):Length2D()
    if distance <= 128 then
        local ability = self:GetAbility()
        local ____table_target_IsMagicImmune_result_16 = self.target
        if ____table_target_IsMagicImmune_result_16 ~= nil then
            ____table_target_IsMagicImmune_result_16 = ____table_target_IsMagicImmune_result_16:IsMagicImmune()
        end
        if not ____table_target_IsMagicImmune_result_16 then
            ApplyDamage({
                attacker = parent,
                victim = self.target,
                damage = self.damage,
                damage_type = self:GetAbility():GetAbilityDamageType(),
                ability = self:GetAbility()
            })
            local ____table_target_AddNewModifier_result_18 = self.target
            if ____table_target_AddNewModifier_result_18 ~= nil then
                ____table_target_AddNewModifier_result_18 = ____table_target_AddNewModifier_result_18:AddNewModifier(
                    parent,
                    ability,
                    "modifier_guy_dynamic_entry_debuff",
                    {duration = self.duration * (1 - self.target:GetStatusResistance())}
                )
            end
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
    local impact_particle = gates_open and "particles/units/heroes/guy/guy_dynamic_entry_six_gates_impact_base.vpcf" or "particles/units/heroes/guy/guy_dynamic_entry_impact_base.vpcf"
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
    ParticleManager:ReleaseParticleIndex(impact_fx)
    local ____gates_open_20
    if gates_open then
        ____gates_open_20 = EmitSoundOn("Hero_Guy.DynamicEntryGate.Impact", self.target)
    else
        ____gates_open_20 = EmitSoundOn("Hero_Guy.DynamicEntry.Impact", self.target)
    end
end
modifier_guy_dynamic_entry = __TS__Decorate(
    {registerModifier(nil)},
    modifier_guy_dynamic_entry
)
____exports.modifier_guy_dynamic_entry = modifier_guy_dynamic_entry
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
    local ____caster_HasModifier_result_21 = caster
    if ____caster_HasModifier_result_21 ~= nil then
        ____caster_HasModifier_result_21 = ____caster_HasModifier_result_21:HasModifier("modifier_guy_seventh_gate")
    end
    local gates_open = ____caster_HasModifier_result_21
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
    {registerModifier(nil)},
    modifier_guy_dynamic_entry_debuff
)
____exports.modifier_guy_dynamic_entry_debuff = modifier_guy_dynamic_entry_debuff
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
    {registerModifier(nil)},
    modifier_guy_dynamic_entry_target
)
____exports.modifier_guy_dynamic_entry_target = modifier_guy_dynamic_entry_target
return ____exports
