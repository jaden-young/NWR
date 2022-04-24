local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__Decorate = ____lualib.__TS__Decorate
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["8"] = 1,["9"] = 1,["10"] = 1,["11"] = 1,["12"] = 1,["13"] = 14,["14"] = 15,["15"] = 14,["16"] = 15,["18"] = 15,["19"] = 17,["20"] = 14,["21"] = 21,["22"] = 22,["23"] = 23,["24"] = 21,["25"] = 29,["26"] = 30,["27"] = 31,["28"] = 32,["29"] = 33,["30"] = 35,["31"] = 37,["32"] = 39,["33"] = 40,["34"] = 40,["35"] = 40,["36"] = 40,["37"] = 40,["38"] = 40,["39"] = 40,["40"] = 40,["41"] = 41,["42"] = 41,["43"] = 41,["44"] = 41,["45"] = 41,["46"] = 41,["47"] = 41,["48"] = 41,["50"] = 29,["51"] = 47,["52"] = 48,["53"] = 49,["54"] = 50,["55"] = 52,["56"] = 53,["57"] = 54,["58"] = 56,["59"] = 57,["60"] = 59,["61"] = 59,["62"] = 59,["63"] = 59,["64"] = 59,["65"] = 59,["66"] = 59,["67"] = 59,["68"] = 60,["69"] = 61,["70"] = 62,["71"] = 63,["72"] = 64,["73"] = 66,["74"] = 66,["75"] = 66,["76"] = 66,["77"] = 66,["78"] = 66,["79"] = 66,["80"] = 66,["81"] = 66,["82"] = 66,["83"] = 66,["84"] = 66,["85"] = 78,["86"] = 78,["87"] = 78,["88"] = 66,["89"] = 66,["90"] = 47,["91"] = 85,["92"] = 86,["93"] = 88,["94"] = 88,["95"] = 88,["97"] = 85,["98"] = 93,["99"] = 94,["100"] = 95,["101"] = 96,["103"] = 99,["104"] = 99,["106"] = 101,["107"] = 102,["108"] = 103,["109"] = 104,["110"] = 106,["111"] = 106,["113"] = 108,["114"] = 108,["115"] = 108,["116"] = 108,["117"] = 108,["118"] = 108,["119"] = 108,["120"] = 116,["121"] = 116,["122"] = 116,["123"] = 116,["124"] = 116,["125"] = 116,["126"] = 117,["127"] = 119,["128"] = 120,["129"] = 93,["130"] = 125,["131"] = 126,["132"] = 128,["133"] = 129,["135"] = 125,["136"] = 15,["137"] = 14,["138"] = 15,["140"] = 15,["141"] = 133,["142"] = 134,["143"] = 133,["144"] = 134,["145"] = 136,["146"] = 136,["147"] = 136,["148"] = 140,["149"] = 141,["150"] = 140,["151"] = 149,["152"] = 150,["153"] = 149,["154"] = 155,["155"] = 156,["156"] = 155,["157"] = 134,["158"] = 133,["159"] = 134,["161"] = 134,["162"] = 160,["163"] = 161,["164"] = 160,["165"] = 161,["166"] = 163,["167"] = 164,["168"] = 164,["169"] = 164,["170"] = 164,["171"] = 164,["172"] = 164,["173"] = 164,["174"] = 163,["175"] = 161,["176"] = 160,["177"] = 161,["179"] = 161});
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
    PrecacheResource("soundfile", "soundevents/heroes/sai/game_sounds_sai.vsndevts", context)
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
    return "particles/units/heroes/hero_snapfire/hero_snapfire_disarm.vpcf"
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
