local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__Decorate = ____lualib.__TS__Decorate
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["8"] = 1,["9"] = 1,["10"] = 1,["11"] = 1,["12"] = 1,["13"] = 9,["14"] = 10,["15"] = 9,["16"] = 10,["17"] = 17,["18"] = 18,["19"] = 19,["20"] = 20,["21"] = 17,["22"] = 25,["23"] = 10,["24"] = 25,["25"] = 31,["26"] = 32,["27"] = 32,["28"] = 32,["29"] = 32,["30"] = 34,["31"] = 31,["32"] = 39,["33"] = 40,["34"] = 40,["35"] = 40,["36"] = 40,["37"] = 39,["38"] = 45,["39"] = 46,["40"] = 47,["41"] = 48,["42"] = 49,["43"] = 50,["44"] = 51,["45"] = 53,["46"] = 55,["47"] = 45,["48"] = 10,["49"] = 9,["50"] = 10,["52"] = 10,["53"] = 59,["54"] = 60,["55"] = 59,["56"] = 60,["57"] = 73,["58"] = 73,["59"] = 73,["60"] = 74,["61"] = 74,["62"] = 74,["63"] = 78,["64"] = 79,["65"] = 80,["66"] = 82,["67"] = 83,["68"] = 84,["69"] = 85,["70"] = 87,["73"] = 88,["74"] = 89,["75"] = 90,["76"] = 92,["77"] = 93,["80"] = 97,["81"] = 98,["82"] = 98,["83"] = 98,["84"] = 98,["85"] = 98,["86"] = 98,["87"] = 98,["88"] = 98,["89"] = 78,["90"] = 103,["91"] = 104,["94"] = 105,["95"] = 107,["96"] = 108,["97"] = 108,["98"] = 108,["99"] = 108,["100"] = 108,["101"] = 110,["102"] = 111,["103"] = 111,["104"] = 111,["105"] = 111,["106"] = 111,["108"] = 103,["109"] = 116,["110"] = 116,["111"] = 116,["112"] = 122,["113"] = 123,["114"] = 122,["115"] = 131,["116"] = 132,["117"] = 134,["118"] = 135,["121"] = 139,["122"] = 140,["123"] = 131,["124"] = 145,["125"] = 146,["126"] = 145,["127"] = 151,["128"] = 152,["129"] = 151,["130"] = 157,["131"] = 158,["132"] = 159,["133"] = 160,["135"] = 163,["136"] = 157,["137"] = 168,["138"] = 169,["139"] = 170,["140"] = 170,["141"] = 170,["142"] = 170,["143"] = 170,["144"] = 170,["145"] = 170,["146"] = 170,["147"] = 170,["148"] = 170,["149"] = 170,["150"] = 182,["151"] = 183,["152"] = 184,["153"] = 186,["154"] = 186,["155"] = 186,["156"] = 186,["157"] = 186,["158"] = 186,["159"] = 188,["160"] = 188,["161"] = 188,["162"] = 188,["163"] = 188,["164"] = 188,["165"] = 188,["166"] = 196,["167"] = 197,["168"] = 197,["169"] = 197,["170"] = 197,["171"] = 197,["172"] = 198,["173"] = 199,["174"] = 200,["177"] = 204,["178"] = 168,["179"] = 209,["180"] = 210,["181"] = 211,["182"] = 213,["183"] = 214,["185"] = 217,["186"] = 209,["187"] = 222,["188"] = 223,["189"] = 224,["190"] = 226,["191"] = 222,["192"] = 231,["193"] = 232,["194"] = 231,["195"] = 237,["196"] = 238,["197"] = 237,["198"] = 60,["199"] = 59,["200"] = 60,["202"] = 60});
local ____exports = {}
local ____dota_ts_adapter = require("lib.dota_ts_adapter")
local BaseAbility = ____dota_ts_adapter.BaseAbility
local BaseModifierMotionHorizontal = ____dota_ts_adapter.BaseModifierMotionHorizontal
local registerAbility = ____dota_ts_adapter.registerAbility
local registerModifier = ____dota_ts_adapter.registerModifier
____exports.raikage_lariat = __TS__Class()
local raikage_lariat = ____exports.raikage_lariat
raikage_lariat.name = "raikage_lariat"
__TS__ClassExtends(raikage_lariat, BaseAbility)
function raikage_lariat.prototype.Precache(self, context)
    PrecacheResource("particle", "particles/units/heroes/raikage/raikage_lariat_impact.vpcf", context)
    PrecacheResource("soundfile", "soundevents/heroes/raikage/game_sounds_raikage.vsndevts", context)
    PrecacheResource("soundfile", "soundevents/heroes/raikage/game_sounds_vo_raikage.vsndevts", context)
end
function raikage_lariat.prototype.GetCastRange(self, location, target)
    return IsClient() and BaseAbility.prototype.GetCastRange(self, location, target) or 50000
end
function raikage_lariat.prototype.OnAbilityPhaseStart(self)
    EmitSoundOn(
        "VO_Hero_Raikage.Lariat.Cast",
        self:GetCaster()
    )
    return true
end
function raikage_lariat.prototype.OnAbilityPhaseInterrupted(self)
    StopSoundOn(
        "VO_Hero_Raikage.Lariat.Cast",
        self:GetCaster()
    )
end
function raikage_lariat.prototype.OnSpellStart(self)
    local caster = self:GetCaster()
    local position = self:GetCursorPosition()
    local origin = caster:GetAbsOrigin()
    local range = self:GetSpecialValueFor("cast_range")
    local distance = (position - origin):Length2D()
    position = distance < range and position or (position - origin):Normalized() * range + origin
    caster:AddNewModifier(caster, self, "modifier_raikage_lariat", {duration = -1, x = position.x, y = position.y, z = position.z})
    EmitSoundOn("Hero_Raikage.Lariat.Cast", caster)
end
raikage_lariat = __TS__Decorate(
    {registerAbility(nil)},
    raikage_lariat
)
____exports.raikage_lariat = raikage_lariat
____exports.modifier_raikage_lariat = __TS__Class()
local modifier_raikage_lariat = ____exports.modifier_raikage_lariat
modifier_raikage_lariat.name = "modifier_raikage_lariat"
__TS__ClassExtends(modifier_raikage_lariat, BaseModifierMotionHorizontal)
function modifier_raikage_lariat.prototype.IsPurgable(self)
    return false
end
function modifier_raikage_lariat.prototype.RemoveOnDeath(self)
    return true
end
function modifier_raikage_lariat.prototype.OnCreated(self, params)
    local ability = self:GetAbility()
    local parent = self:GetParent()
    self.stun_duration = ability:GetSpecialValueFor("stun_duration")
    self.speed = ability:GetSpecialValueFor("speed")
    self.damage = ability:GetSpecialValueFor("damage") + parent:FindTalentValue("special_bonus_raikage_3")
    self.search_radius = parent:GetPaddedCollisionRadius() * 2
    if not IsServer() then
        return
    end
    self.origin = parent:GetAbsOrigin()
    self.position = Vector(params.x, params.y, params.z)
    self.distance_to_cross = (self.position - parent:GetAbsOrigin()):Length2D()
    if not self:ApplyHorizontalMotionController() then
        self:Destroy()
        return
    end
    local ground_fx = ParticleManager:CreateParticle("particles/units/heroes/raikage/lariat_ground_parent.vpcf", PATTACH_ABSORIGIN_FOLLOW, parent)
    self:AddParticle(
        ground_fx,
        false,
        false,
        -1,
        false,
        false
    )
end
function modifier_raikage_lariat.prototype.OnDestroy(self)
    if not IsServer() then
        return
    end
    local parent = self:GetParent()
    parent:RemoveHorizontalMotionController(self)
    GridNav:DestroyTreesAroundPoint(
        parent:GetAbsOrigin(),
        self.search_radius,
        true
    )
    if GridNav:IsBlocked(parent:GetAbsOrigin()) then
        FindClearSpaceForUnit(
            parent,
            parent:GetAbsOrigin(),
            false
        )
    end
end
function modifier_raikage_lariat.prototype.DeclareFunctions(self)
    return {MODIFIER_PROPERTY_OVERRIDE_ANIMATION}
end
function modifier_raikage_lariat.prototype.CheckState(self)
    return {[MODIFIER_STATE_NO_UNIT_COLLISION] = true, [MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY] = true}
end
function modifier_raikage_lariat.prototype.UpdateHorizontalMotion(self, parent, dt)
    local direction = (self.position - parent:GetAbsOrigin()):Normalized()
    if self:CheckConditions() or self:CheckAreaForEnemies() or self:CheckDistance() then
        self:Destroy()
        return
    end
    parent:FaceTowards(self.position)
    parent:SetAbsOrigin(parent:GetAbsOrigin() + self.speed * direction * dt)
end
function modifier_raikage_lariat.prototype.OnHorizontalMotionInterrupted(self)
    self:Destroy()
end
function modifier_raikage_lariat.prototype.GetOverrideAnimation(self)
    return ACT_DOTA_CAST_ABILITY_2
end
function modifier_raikage_lariat.prototype.CheckConditions(self)
    local parent = self:GetParent()
    if parent:IsStunned() or parent:IsHexed() or parent:IsRooted() then
        return true
    end
    return false
end
function modifier_raikage_lariat.prototype.CheckAreaForEnemies(self)
    local parent = self:GetParent()
    local enemies = FindUnitsInRadius(
        parent:GetTeamNumber(),
        parent:GetAbsOrigin(),
        nil,
        self.search_radius,
        DOTA_UNIT_TARGET_TEAM_ENEMY,
        DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_HERO,
        DOTA_UNIT_TARGET_FLAG_NO_INVIS,
        FIND_ANY_ORDER,
        false
    )
    for ____, enemy in ipairs(enemies) do
        if self:IsFacingTarget(enemy) then
            local ability = self:GetAbility()
            enemy:AddNewModifier(
                parent,
                ability,
                "modifier_stunned",
                {duration = self.stun_duration * (1 - enemy:GetStatusResistance())}
            )
            ApplyDamage({
                attacker = parent,
                victim = enemy,
                damage = self.damage,
                damage_type = ability:GetAbilityDamageType(),
                ability = ability
            })
            local impact_fx = ParticleManager:CreateParticle("particles/units/heroes/raikage/raikage_lariat_impact.vpcf", PATTACH_ABSORIGIN, enemy)
            ParticleManager:SetParticleControl(
                impact_fx,
                3,
                enemy:GetAbsOrigin() + Vector(0, 0, 70)
            )
            ParticleManager:ReleaseParticleIndex(impact_fx)
            EmitSoundOn("Hero_Raikage.Lariat.Impact", enemy)
            return true
        end
    end
    return false
end
function modifier_raikage_lariat.prototype.CheckDistance(self)
    local parent = self:GetParent()
    local distance = (parent:GetAbsOrigin() - self.origin):Length2D()
    if distance >= self.distance_to_cross then
        return true
    end
    return false
end
function modifier_raikage_lariat.prototype.IsFacingTarget(self, target)
    local direction = (target:GetAbsOrigin() - self:GetParent():GetAbsOrigin()):Normalized()
    local parent_facing_direction = self:GetParent():GetForwardVector()
    return parent_facing_direction:Dot(direction) > 0
end
function modifier_raikage_lariat.prototype.GetEffectName(self)
    return "particles/units/heroes/raikage/lariat_aura.vpcf"
end
function modifier_raikage_lariat.prototype.GetEffectAttachType(self)
    return PATTACH_ABSORIGIN_FOLLOW
end
modifier_raikage_lariat = __TS__Decorate(
    {registerModifier(nil)},
    modifier_raikage_lariat
)
____exports.modifier_raikage_lariat = modifier_raikage_lariat
return ____exports
