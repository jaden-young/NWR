local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__Decorate = ____lualib.__TS__Decorate
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["8"] = 1,["9"] = 1,["10"] = 1,["11"] = 1,["12"] = 1,["13"] = 9,["14"] = 10,["15"] = 9,["16"] = 10,["17"] = 17,["18"] = 18,["19"] = 19,["20"] = 20,["21"] = 21,["22"] = 17,["23"] = 26,["24"] = 10,["25"] = 26,["26"] = 32,["27"] = 33,["28"] = 33,["29"] = 33,["30"] = 33,["31"] = 35,["32"] = 32,["33"] = 40,["34"] = 41,["35"] = 41,["36"] = 41,["37"] = 41,["38"] = 40,["39"] = 46,["40"] = 47,["41"] = 48,["42"] = 49,["43"] = 50,["44"] = 51,["45"] = 52,["46"] = 54,["47"] = 56,["48"] = 46,["49"] = 10,["50"] = 9,["51"] = 10,["53"] = 10,["54"] = 60,["55"] = 61,["56"] = 60,["57"] = 61,["58"] = 74,["59"] = 74,["60"] = 74,["61"] = 75,["62"] = 75,["63"] = 75,["64"] = 79,["65"] = 80,["66"] = 81,["67"] = 83,["68"] = 84,["69"] = 85,["70"] = 86,["71"] = 88,["74"] = 89,["75"] = 90,["76"] = 91,["77"] = 93,["78"] = 94,["81"] = 100,["82"] = 101,["83"] = 101,["84"] = 101,["85"] = 101,["86"] = 101,["87"] = 101,["88"] = 101,["89"] = 101,["90"] = 79,["91"] = 106,["92"] = 107,["95"] = 108,["96"] = 110,["97"] = 111,["98"] = 111,["99"] = 111,["100"] = 111,["101"] = 111,["102"] = 113,["103"] = 114,["104"] = 114,["105"] = 114,["106"] = 114,["107"] = 114,["109"] = 106,["110"] = 119,["111"] = 119,["112"] = 119,["113"] = 125,["114"] = 126,["115"] = 125,["116"] = 134,["117"] = 135,["118"] = 137,["119"] = 138,["122"] = 142,["123"] = 143,["124"] = 134,["125"] = 148,["126"] = 149,["127"] = 148,["128"] = 154,["129"] = 155,["130"] = 154,["131"] = 160,["132"] = 161,["133"] = 162,["134"] = 163,["136"] = 166,["137"] = 160,["138"] = 171,["139"] = 172,["140"] = 173,["141"] = 173,["142"] = 173,["143"] = 173,["144"] = 173,["145"] = 173,["146"] = 173,["147"] = 173,["148"] = 173,["149"] = 173,["150"] = 173,["151"] = 185,["152"] = 186,["153"] = 187,["154"] = 189,["155"] = 189,["156"] = 189,["157"] = 189,["158"] = 189,["159"] = 189,["160"] = 191,["161"] = 191,["162"] = 191,["163"] = 191,["164"] = 191,["165"] = 191,["166"] = 191,["167"] = 199,["168"] = 200,["169"] = 200,["170"] = 200,["171"] = 200,["172"] = 200,["173"] = 201,["174"] = 202,["175"] = 203,["178"] = 207,["179"] = 171,["180"] = 212,["181"] = 213,["182"] = 214,["183"] = 216,["184"] = 217,["186"] = 220,["187"] = 212,["188"] = 225,["189"] = 226,["190"] = 227,["191"] = 229,["192"] = 225,["193"] = 234,["194"] = 235,["195"] = 234,["196"] = 240,["197"] = 241,["198"] = 240,["199"] = 61,["200"] = 60,["201"] = 61,["203"] = 61});
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
    PrecacheResource("particle", "particles/units/heroes/raikage/raikage_lariat_dash.vpcf", context)
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
    local ground_fx = ParticleManager:CreateParticle("particles/units/heroes/raikage/raikage_lariat_dash.vpcf", PATTACH_ABSORIGIN_FOLLOW, parent)
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
