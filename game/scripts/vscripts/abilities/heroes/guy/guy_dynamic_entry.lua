local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__Decorate = ____lualib.__TS__Decorate
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["8"] = 1,["9"] = 1,["10"] = 1,["11"] = 1,["12"] = 1,["13"] = 1,["14"] = 7,["15"] = 8,["16"] = 7,["17"] = 8,["18"] = 15,["19"] = 16,["20"] = 17,["21"] = 18,["22"] = 19,["23"] = 20,["24"] = 21,["25"] = 15,["26"] = 26,["27"] = 27,["28"] = 26,["29"] = 32,["30"] = 33,["31"] = 8,["33"] = 8,["35"] = 32,["36"] = 41,["37"] = 42,["38"] = 43,["39"] = 45,["40"] = 45,["41"] = 45,["43"] = 45,["46"] = 47,["47"] = 47,["48"] = 47,["49"] = 47,["50"] = 47,["51"] = 47,["52"] = 47,["53"] = 47,["55"] = 47,["56"] = 47,["57"] = 47,["58"] = 47,["59"] = 47,["60"] = 47,["61"] = 47,["62"] = 49,["63"] = 49,["64"] = 50,["66"] = 51,["68"] = 41,["69"] = 8,["70"] = 7,["71"] = 8,["73"] = 8,["74"] = 55,["75"] = 56,["76"] = 55,["77"] = 56,["78"] = 67,["79"] = 67,["80"] = 67,["81"] = 68,["82"] = 68,["83"] = 68,["84"] = 72,["85"] = 73,["86"] = 75,["87"] = 76,["88"] = 77,["89"] = 78,["90"] = 80,["93"] = 81,["94"] = 83,["95"] = 84,["98"] = 72,["99"] = 91,["100"] = 92,["103"] = 93,["104"] = 95,["105"] = 97,["106"] = 98,["108"] = 91,["109"] = 104,["110"] = 104,["111"] = 104,["112"] = 110,["113"] = 111,["114"] = 110,["115"] = 119,["116"] = 120,["117"] = 122,["118"] = 123,["121"] = 125,["122"] = 126,["123"] = 119,["124"] = 131,["125"] = 132,["126"] = 131,["127"] = 137,["128"] = 138,["129"] = 137,["130"] = 143,["131"] = 144,["132"] = 145,["134"] = 145,["135"] = 145,["136"] = 145,["138"] = 145,["140"] = 145,["142"] = 145,["143"] = 145,["144"] = 145,["146"] = 145,["148"] = 145,["149"] = 145,["151"] = 143,["152"] = 150,["153"] = 151,["154"] = 152,["155"] = 154,["156"] = 155,["157"] = 157,["158"] = 157,["159"] = 157,["161"] = 157,["162"] = 158,["163"] = 158,["164"] = 158,["165"] = 158,["166"] = 158,["167"] = 158,["168"] = 158,["169"] = 166,["170"] = 166,["171"] = 166,["172"] = 166,["173"] = 166,["174"] = 166,["175"] = 166,["176"] = 166,["179"] = 169,["180"] = 171,["181"] = 172,["182"] = 173,["183"] = 174,["184"] = 175,["186"] = 178,["187"] = 150,["188"] = 183,["189"] = 184,["190"] = 185,["191"] = 186,["192"] = 188,["193"] = 189,["194"] = 189,["195"] = 189,["196"] = 189,["197"] = 189,["198"] = 189,["199"] = 189,["200"] = 189,["201"] = 189,["202"] = 190,["203"] = 190,["204"] = 190,["205"] = 190,["206"] = 190,["207"] = 190,["208"] = 190,["209"] = 190,["210"] = 190,["211"] = 191,["212"] = 191,["213"] = 191,["214"] = 191,["215"] = 191,["216"] = 192,["217"] = 194,["218"] = 194,["219"] = 194,["221"] = 194,["223"] = 195,["224"] = 183,["225"] = 56,["226"] = 55,["227"] = 56,["229"] = 56,["230"] = 199,["231"] = 200,["232"] = 199,["233"] = 200,["235"] = 200,["236"] = 203,["237"] = 199,["238"] = 207,["239"] = 208,["240"] = 209,["241"] = 210,["242"] = 210,["243"] = 210,["245"] = 210,["246"] = 212,["247"] = 214,["248"] = 215,["249"] = 216,["251"] = 207,["252"] = 222,["253"] = 222,["254"] = 222,["255"] = 226,["256"] = 227,["257"] = 226,["258"] = 232,["259"] = 233,["260"] = 232,["261"] = 238,["262"] = 239,["263"] = 238,["264"] = 200,["265"] = 199,["266"] = 200,["268"] = 200,["269"] = 243,["270"] = 244,["271"] = 243,["272"] = 244,["273"] = 246,["274"] = 246,["275"] = 246,["276"] = 247,["277"] = 247,["278"] = 247,["279"] = 251,["280"] = 252,["281"] = 251,["282"] = 244,["283"] = 243,["284"] = 244,["286"] = 244});
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
    EmitSoundOn("Hero_Guy.DynamicEntry.ImpactLayer", self.target)
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
