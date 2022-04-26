local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__Decorate = ____lualib.__TS__Decorate
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["8"] = 1,["9"] = 1,["10"] = 1,["11"] = 1,["12"] = 1,["13"] = 14,["14"] = 15,["15"] = 14,["16"] = 15,["18"] = 15,["19"] = 17,["20"] = 14,["21"] = 21,["22"] = 22,["23"] = 23,["24"] = 24,["25"] = 25,["26"] = 21,["27"] = 30,["28"] = 31,["29"] = 31,["30"] = 31,["31"] = 31,["32"] = 32,["33"] = 32,["34"] = 32,["35"] = 32,["36"] = 33,["37"] = 30,["38"] = 39,["39"] = 40,["40"] = 41,["41"] = 42,["42"] = 43,["43"] = 45,["44"] = 47,["45"] = 49,["46"] = 50,["47"] = 50,["48"] = 50,["49"] = 50,["50"] = 50,["51"] = 50,["52"] = 50,["53"] = 50,["54"] = 51,["55"] = 51,["56"] = 51,["57"] = 51,["58"] = 51,["59"] = 51,["60"] = 51,["61"] = 51,["63"] = 39,["64"] = 57,["65"] = 58,["66"] = 59,["67"] = 60,["68"] = 62,["69"] = 63,["70"] = 64,["71"] = 66,["72"] = 67,["73"] = 69,["74"] = 69,["75"] = 69,["76"] = 69,["77"] = 69,["78"] = 69,["79"] = 69,["80"] = 69,["81"] = 70,["82"] = 71,["83"] = 72,["84"] = 73,["85"] = 74,["86"] = 75,["87"] = 77,["88"] = 77,["89"] = 77,["90"] = 77,["91"] = 77,["92"] = 77,["93"] = 77,["94"] = 77,["95"] = 77,["96"] = 77,["97"] = 77,["98"] = 77,["99"] = 89,["100"] = 89,["101"] = 89,["102"] = 77,["103"] = 77,["104"] = 57,["105"] = 96,["106"] = 97,["107"] = 99,["108"] = 99,["109"] = 99,["111"] = 96,["112"] = 104,["113"] = 105,["114"] = 106,["115"] = 107,["117"] = 110,["118"] = 110,["120"] = 112,["121"] = 113,["122"] = 114,["123"] = 115,["124"] = 117,["125"] = 117,["127"] = 119,["128"] = 119,["129"] = 119,["130"] = 119,["131"] = 119,["132"] = 119,["133"] = 119,["134"] = 127,["135"] = 127,["136"] = 127,["137"] = 127,["138"] = 127,["139"] = 127,["140"] = 128,["141"] = 130,["142"] = 132,["143"] = 133,["144"] = 134,["145"] = 134,["146"] = 134,["147"] = 134,["148"] = 134,["149"] = 135,["151"] = 138,["152"] = 104,["153"] = 143,["154"] = 144,["155"] = 146,["156"] = 147,["158"] = 143,["159"] = 15,["160"] = 14,["161"] = 15,["163"] = 15,["164"] = 151,["165"] = 152,["166"] = 151,["167"] = 152,["168"] = 154,["169"] = 154,["170"] = 154,["171"] = 158,["172"] = 159,["173"] = 158,["174"] = 167,["175"] = 168,["176"] = 167,["177"] = 173,["178"] = 174,["179"] = 173,["180"] = 152,["181"] = 151,["182"] = 152,["184"] = 152,["185"] = 178,["186"] = 179,["187"] = 178,["188"] = 179,["189"] = 181,["190"] = 182,["191"] = 182,["192"] = 182,["193"] = 182,["194"] = 182,["195"] = 182,["196"] = 182,["197"] = 181,["198"] = 179,["199"] = 178,["200"] = 179,["202"] = 179});
local ____exports = {}
local ____dota_ts_adapter = require("lib.dota_ts_adapter")
local BaseAbility = ____dota_ts_adapter.BaseAbility
local BaseModifier = ____dota_ts_adapter.BaseModifier
local registerAbility = ____dota_ts_adapter.registerAbility
local registerModifier = ____dota_ts_adapter.registerModifier
____exports.sai_super_beast_drawing = __TS__Class()
local sai_super_beast_drawing = ____exports.sai_super_beast_drawing
sai_super_beast_drawing.name = "sai_super_beast_drawing"
__TS__ClassExtends(sai_super_beast_drawing, BaseAbility)
function sai_super_beast_drawing.prototype.____constructor(self, ...)
    BaseAbility.prototype.____constructor(self, ...)
    self.drawing_projectiles = {}
end
function sai_super_beast_drawing.prototype.Precache(self, context)
    PrecacheResource("particle", "particles/units/heroes/sai/sai_super_beast_drawing_proj.vpcf", context)
    PrecacheResource("particle", "particles/units/heroes/sai/sai_disarm.vpcf", context)
    PrecacheResource("soundfile", "soundevents/heroes/sai/game_sounds_sai.vsndevts", context)
    PrecacheResource("soundfile", "soundevents/heroes/sai/game_sounds_vo_sai.vsndevts", context)
end
function sai_super_beast_drawing.prototype.OnAbilityPhaseStart(self)
    EmitSoundOn(
        "VO_Hero_Sai.SuperBeastDrawing.Cast",
        self:GetCaster()
    )
    EmitSoundOn(
        "Hero_Sai.SuperBeastDrawing.PreCast",
        self:GetCaster()
    )
    return true
end
function sai_super_beast_drawing.prototype.OnSpellStart(self)
    local caster = self:GetCaster()
    local origin = caster:GetAbsOrigin()
    local position = origin + (self:GetCursorPosition() - origin):Normalized() * self:GetEffectiveCastRange(origin, caster)
    local id = GameRules:GetDOTATime(true, true)
    self.drawing_projectiles[id] = {}
    self:LaunchDrawing(position, id)
    if caster:HasTalent("special_bonus_sai_6") then
        self:LaunchDrawing(
            RotatePosition(
                origin,
                QAngle(0, -30, 0),
                position
            ),
            id
        )
        self:LaunchDrawing(
            RotatePosition(
                origin,
                QAngle(0, 30, 0),
                position
            ),
            id
        )
    end
end
function sai_super_beast_drawing.prototype.LaunchDrawing(self, position, id)
    local caster = self:GetCaster()
    local distance = self:GetEffectiveCastRange(position, caster)
    local radius = self:GetSpecialValueFor("radius")
    local direction = position - caster:GetAbsOrigin()
    direction.z = 0
    direction = direction:Normalized()
    local spawn_pos = caster:GetAttachmentOrigin(caster:ScriptLookupAttachment("attach_hitloc")) + direction * 75
    spawn_pos.z = GetGroundPosition(spawn_pos, nil).z
    local beast = CreateUnitByName(
        "npc_dota_sai_lion",
        spawn_pos,
        false,
        nil,
        nil,
        caster:GetTeamNumber()
    )
    beast:AddNewModifier(caster, self, "modifier_sai_super_beast_drawing_beast", {duration = -1})
    beast:SetForwardVector(caster:GetForwardVector())
    beast:FaceTowards(position)
    beast:StartGesture(ACT_DOTA_RUN)
    EmitSoundOn("Hero_Sai.SuperBeastDrawing.Cast", beast)
    EmitSoundOn("Hero_Sai.SuperBeastDrawing.Roar", beast)
    ProjectileManager:CreateLinearProjectile({
        Ability = self,
        EffectName = "particles/units/heroes/sai/sai_super_beast_drawing_proj.vpcf",
        vSpawnOrigin = spawn_pos,
        fDistance = distance,
        fStartRadius = radius,
        fEndRadius = radius,
        Source = caster,
        iUnitTargetTeam = self:GetAbilityTargetTeam(),
        iUnitTargetType = self:GetAbilityTargetType(),
        iUnitTargetFlags = self:GetAbilityTargetFlags(),
        vVelocity = direction * self:GetSpecialValueFor("speed"),
        ExtraData = {
            id = id,
            beast_eid = beast:entindex()
        }
    })
end
function sai_super_beast_drawing.prototype.OnProjectileThink_ExtraData(self, location, extraData)
    local beast = EntIndexToHScript(extraData.beast_eid)
    local ____beast_SetAbsOrigin_result_0 = beast
    if ____beast_SetAbsOrigin_result_0 ~= nil then
        ____beast_SetAbsOrigin_result_0 = ____beast_SetAbsOrigin_result_0:SetAbsOrigin(GetGroundPosition(location, beast))
    end
end
function sai_super_beast_drawing.prototype.OnProjectileHit_ExtraData(self, target, location, extraData)
    if not target then
        self:KillBeast(extraData.beast_eid)
        return true
    end
    if self.drawing_projectiles[extraData.id][target:entindex()] then
        return false
    end
    local caster = self:GetCaster()
    local duration = self:GetSpecialValueFor("root_duration")
    local innate = caster:FindAbilityByName("sai_innate_passive")
    self:KillBeast(extraData.beast_eid)
    if innate then
        innate:ApplyDebuff(target)
    end
    ApplyDamage({
        attacker = caster,
        victim = target,
        damage = self:GetSpecialValueFor("damage"),
        damage_type = self:GetAbilityDamageType(),
        ability = self
    })
    target:AddNewModifier(
        caster,
        self,
        "modifier_sai_super_beast_drawing",
        {duration = duration * (1 - target:GetStatusResistance())}
    )
    self.drawing_projectiles[extraData.id][target:entindex()] = true
    EmitSoundOnLocationWithCaster(location, "Hero_Sai.SuperBeastDrawing.Impact", caster)
    if (target:GetAbsOrigin() - caster:GetAbsOrigin()):Length2D() >= self:GetSpecialValueFor("point_blank_radius") then
        local impact_fx = ParticleManager:CreateParticle("particles/units/heroes/sai/sai_super_beast_drawing_projh.vpcf", PATTACH_ABSORIGIN, target)
        ParticleManager:SetParticleControl(
            impact_fx,
            3,
            target:GetAbsOrigin()
        )
        ParticleManager:ReleaseParticleIndex(impact_fx)
    end
    return true
end
function sai_super_beast_drawing.prototype.KillBeast(self, id)
    local beast = EntIndexToHScript(id)
    if beast then
        UTIL_Remove(beast)
    end
end
sai_super_beast_drawing = __TS__Decorate(
    {registerAbility(nil)},
    sai_super_beast_drawing
)
____exports.sai_super_beast_drawing = sai_super_beast_drawing
____exports.modifier_sai_super_beast_drawing = __TS__Class()
local modifier_sai_super_beast_drawing = ____exports.modifier_sai_super_beast_drawing
modifier_sai_super_beast_drawing.name = "modifier_sai_super_beast_drawing"
__TS__ClassExtends(modifier_sai_super_beast_drawing, BaseModifier)
function modifier_sai_super_beast_drawing.prototype.IsPurgable(self)
    return true
end
function modifier_sai_super_beast_drawing.prototype.CheckState(self)
    return {[MODIFIER_STATE_ROOTED] = true, [MODIFIER_STATE_DISARMED] = true}
end
function modifier_sai_super_beast_drawing.prototype.GetEffectName(self)
    return "particles/units/heroes/sai/sai_disarm.vpcf"
end
function modifier_sai_super_beast_drawing.prototype.GetEffectAttachType(self)
    return PATTACH_OVERHEAD_FOLLOW
end
modifier_sai_super_beast_drawing = __TS__Decorate(
    {registerModifier(nil)},
    modifier_sai_super_beast_drawing
)
____exports.modifier_sai_super_beast_drawing = modifier_sai_super_beast_drawing
____exports.modifier_sai_super_beast_drawing_beast = __TS__Class()
local modifier_sai_super_beast_drawing_beast = ____exports.modifier_sai_super_beast_drawing_beast
modifier_sai_super_beast_drawing_beast.name = "modifier_sai_super_beast_drawing_beast"
__TS__ClassExtends(modifier_sai_super_beast_drawing_beast, BaseModifier)
function modifier_sai_super_beast_drawing_beast.prototype.CheckState(self)
    return {
        [MODIFIER_STATE_NO_HEALTH_BAR] = true,
        [MODIFIER_STATE_DISARMED] = true,
        [MODIFIER_STATE_NOT_ON_MINIMAP] = true,
        [MODIFIER_STATE_OUT_OF_GAME] = true,
        [MODIFIER_STATE_INVULNERABLE] = true
    }
end
modifier_sai_super_beast_drawing_beast = __TS__Decorate(
    {registerModifier(nil)},
    modifier_sai_super_beast_drawing_beast
)
____exports.modifier_sai_super_beast_drawing_beast = modifier_sai_super_beast_drawing_beast
return ____exports
