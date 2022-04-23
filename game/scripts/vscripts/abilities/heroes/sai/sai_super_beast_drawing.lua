local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__Decorate = ____lualib.__TS__Decorate
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["8"] = 1,["9"] = 1,["10"] = 1,["11"] = 1,["12"] = 1,["13"] = 14,["14"] = 15,["15"] = 14,["16"] = 15,["18"] = 15,["19"] = 17,["20"] = 14,["21"] = 21,["22"] = 23,["23"] = 21,["24"] = 29,["25"] = 30,["26"] = 31,["27"] = 32,["28"] = 33,["29"] = 35,["30"] = 37,["31"] = 39,["32"] = 40,["33"] = 40,["34"] = 40,["35"] = 40,["36"] = 40,["37"] = 40,["38"] = 40,["39"] = 40,["40"] = 41,["41"] = 41,["42"] = 41,["43"] = 41,["44"] = 41,["45"] = 41,["46"] = 41,["47"] = 41,["49"] = 44,["50"] = 29,["51"] = 49,["52"] = 50,["53"] = 51,["54"] = 52,["55"] = 54,["56"] = 55,["57"] = 56,["58"] = 58,["59"] = 59,["60"] = 61,["61"] = 61,["62"] = 61,["63"] = 61,["64"] = 61,["65"] = 61,["66"] = 61,["67"] = 61,["68"] = 62,["69"] = 63,["70"] = 64,["71"] = 65,["72"] = 67,["73"] = 67,["74"] = 67,["75"] = 67,["76"] = 67,["77"] = 67,["78"] = 67,["79"] = 67,["80"] = 67,["81"] = 67,["82"] = 67,["83"] = 67,["84"] = 79,["85"] = 79,["86"] = 79,["87"] = 67,["88"] = 67,["89"] = 49,["90"] = 86,["91"] = 87,["92"] = 89,["93"] = 89,["94"] = 89,["96"] = 86,["97"] = 94,["98"] = 95,["99"] = 96,["100"] = 97,["102"] = 100,["103"] = 100,["105"] = 102,["106"] = 103,["107"] = 104,["108"] = 105,["109"] = 107,["110"] = 107,["112"] = 109,["113"] = 109,["114"] = 109,["115"] = 109,["116"] = 109,["117"] = 109,["118"] = 109,["119"] = 117,["120"] = 117,["121"] = 117,["122"] = 117,["123"] = 117,["124"] = 117,["125"] = 118,["126"] = 120,["127"] = 121,["128"] = 94,["129"] = 126,["130"] = 127,["131"] = 129,["132"] = 130,["134"] = 126,["135"] = 15,["136"] = 14,["137"] = 15,["139"] = 15,["140"] = 134,["141"] = 135,["142"] = 134,["143"] = 135,["144"] = 137,["145"] = 137,["146"] = 137,["147"] = 141,["148"] = 142,["149"] = 141,["150"] = 150,["151"] = 151,["152"] = 150,["153"] = 156,["154"] = 157,["155"] = 156,["156"] = 135,["157"] = 134,["158"] = 135,["160"] = 135,["161"] = 161,["162"] = 162,["163"] = 161,["164"] = 162,["165"] = 164,["166"] = 165,["167"] = 165,["168"] = 165,["169"] = 165,["170"] = 165,["171"] = 165,["172"] = 165,["173"] = 164,["174"] = 162,["175"] = 161,["176"] = 162,["178"] = 162});
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
    EmitSoundOn("Hero_Sai.SuperBeastDrawing.Cast", caster)
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
    ProjectileManager:CreateLinearProjectile({
        Ability = self,
        EffectName = "particles/units/heroes/hero_grimstroke/grimstroke_darkartistry_proj.vpcf",
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
    EmitSoundOn("Hero_Sai.SuperBeastDrawing.Impact", target)
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
