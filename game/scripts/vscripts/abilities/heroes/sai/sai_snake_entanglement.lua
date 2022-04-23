local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__Decorate = ____lualib.__TS__Decorate
local __TS__ArrayForEach = ____lualib.__TS__ArrayForEach
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["9"] = 1,["10"] = 1,["11"] = 1,["12"] = 1,["13"] = 1,["14"] = 8,["15"] = 9,["16"] = 8,["17"] = 9,["18"] = 11,["19"] = 13,["20"] = 11,["21"] = 19,["22"] = 20,["23"] = 19,["24"] = 25,["25"] = 26,["26"] = 27,["27"] = 28,["28"] = 30,["29"] = 30,["30"] = 30,["31"] = 30,["32"] = 30,["33"] = 30,["34"] = 30,["35"] = 30,["36"] = 30,["37"] = 32,["38"] = 25,["39"] = 9,["40"] = 8,["41"] = 9,["43"] = 9,["44"] = 36,["45"] = 37,["46"] = 36,["47"] = 37,["49"] = 37,["50"] = 39,["51"] = 36,["52"] = 44,["53"] = 45,["56"] = 46,["57"] = 48,["58"] = 49,["59"] = 51,["60"] = 51,["61"] = 51,["62"] = 51,["63"] = 51,["64"] = 52,["65"] = 52,["66"] = 52,["67"] = 52,["68"] = 52,["69"] = 53,["70"] = 53,["71"] = 53,["72"] = 53,["73"] = 53,["74"] = 53,["75"] = 53,["76"] = 53,["77"] = 53,["78"] = 54,["79"] = 54,["80"] = 54,["81"] = 54,["82"] = 54,["83"] = 54,["84"] = 54,["85"] = 54,["86"] = 56,["87"] = 57,["88"] = 44,["89"] = 60,["90"] = 61,["91"] = 63,["92"] = 63,["93"] = 63,["94"] = 63,["95"] = 63,["96"] = 63,["97"] = 63,["98"] = 63,["99"] = 63,["100"] = 63,["101"] = 63,["102"] = 73,["103"] = 73,["104"] = 73,["105"] = 74,["106"] = 74,["107"] = 74,["108"] = 74,["109"] = 74,["110"] = 74,["111"] = 73,["112"] = 73,["113"] = 60,["114"] = 37,["115"] = 36,["116"] = 37,["118"] = 37,["119"] = 80,["120"] = 81,["121"] = 80,["122"] = 81,["123"] = 92,["124"] = 93,["125"] = 94,["126"] = 96,["127"] = 97,["128"] = 98,["129"] = 99,["130"] = 101,["131"] = 103,["134"] = 105,["135"] = 105,["136"] = 105,["137"] = 105,["138"] = 105,["139"] = 105,["140"] = 105,["141"] = 113,["142"] = 114,["143"] = 114,["145"] = 116,["146"] = 117,["147"] = 92,["148"] = 120,["149"] = 121,["150"] = 120,["151"] = 126,["152"] = 127,["153"] = 129,["156"] = 131,["157"] = 132,["158"] = 132,["160"] = 126,["161"] = 137,["162"] = 137,["163"] = 137,["164"] = 144,["165"] = 145,["166"] = 144,["167"] = 150,["168"] = 151,["169"] = 150,["170"] = 156,["171"] = 157,["172"] = 156,["173"] = 162,["174"] = 163,["175"] = 162,["176"] = 81,["177"] = 80,["178"] = 81,["180"] = 81});
local ____exports = {}
local ____dota_ts_adapter = require("lib.dota_ts_adapter")
local BaseAbility = ____dota_ts_adapter.BaseAbility
local BaseModifier = ____dota_ts_adapter.BaseModifier
local registerAbility = ____dota_ts_adapter.registerAbility
local registerModifier = ____dota_ts_adapter.registerModifier
____exports.sai_snake_entanglement = __TS__Class()
local sai_snake_entanglement = ____exports.sai_snake_entanglement
sai_snake_entanglement.name = "sai_snake_entanglement"
__TS__ClassExtends(sai_snake_entanglement, BaseAbility)
function sai_snake_entanglement.prototype.Precache(self, context)
    PrecacheResource("soundfile", "soundevents/heroes/sai/game_sounds_sai.vsndevts", context)
end
function sai_snake_entanglement.prototype.GetAOERadius(self)
    return self:GetSpecialValueFor("radius")
end
function sai_snake_entanglement.prototype.OnSpellStart(self)
    local caster = self:GetCaster()
    local position = self:GetCursorPosition()
    local duration = self:GetSpecialValueFor("duration")
    CreateModifierThinker(
        caster,
        self,
        "modifier_sai_snake_entanglement",
        {duration = duration},
        position,
        caster:GetTeamNumber(),
        false
    )
    EmitSoundOnLocationWithCaster(position, "Hero_Sai.SnakeEntanglement.Cast", caster)
end
sai_snake_entanglement = __TS__Decorate(
    {registerAbility(nil)},
    sai_snake_entanglement
)
____exports.sai_snake_entanglement = sai_snake_entanglement
____exports.modifier_sai_snake_entanglement = __TS__Class()
local modifier_sai_snake_entanglement = ____exports.modifier_sai_snake_entanglement
modifier_sai_snake_entanglement.name = "modifier_sai_snake_entanglement"
__TS__ClassExtends(modifier_sai_snake_entanglement, BaseModifier)
function modifier_sai_snake_entanglement.prototype.____constructor(self, ...)
    BaseModifier.prototype.____constructor(self, ...)
    self.radius = 0
end
function modifier_sai_snake_entanglement.prototype.OnCreated(self, params)
    if not IsServer() then
        return
    end
    local ability = self:GetAbility()
    self.radius = ability:GetSpecialValueFor("radius")
    self.debuff_duration = ability:GetSpecialValueFor("debuff_duration")
    local pit_fx = ParticleManager:CreateParticle(
        "particles/econ/items/underlord/underlord_ti8_immortal_weapon/underlord_ti8_immortal_pitofmalice.vpcf",
        PATTACH_ABSORIGIN,
        self:GetParent()
    )
    ParticleManager:SetParticleControl(
        pit_fx,
        1,
        Vector(self.radius, self.radius / 40, 1)
    )
    ParticleManager:SetParticleControl(
        pit_fx,
        2,
        Vector(
            self:GetRemainingTime(),
            0,
            0
        )
    )
    self:AddParticle(
        pit_fx,
        false,
        false,
        -1,
        false,
        false
    )
    self:StartIntervalThink(ability:GetSpecialValueFor("slow_growth_interval"))
    self:OnIntervalThink()
end
function modifier_sai_snake_entanglement.prototype.OnIntervalThink(self)
    local parent = self:GetParent()
    local enemies = FindUnitsInRadius(
        parent:GetTeamNumber(),
        parent:GetAbsOrigin(),
        nil,
        self.radius,
        DOTA_UNIT_TARGET_TEAM_ENEMY,
        DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_HERO,
        DOTA_UNIT_TARGET_FLAG_NONE,
        FIND_ANY_ORDER,
        false
    )
    __TS__ArrayForEach(
        enemies,
        function(____, enemy)
            enemy:AddNewModifier(
                self:GetCaster(),
                self:GetAbility(),
                "modifier_sai_snake_entanglement_slow",
                {duration = self.debuff_duration}
            )
        end
    )
end
modifier_sai_snake_entanglement = __TS__Decorate(
    {registerModifier(nil)},
    modifier_sai_snake_entanglement
)
____exports.modifier_sai_snake_entanglement = modifier_sai_snake_entanglement
____exports.modifier_sai_snake_entanglement_slow = __TS__Class()
local modifier_sai_snake_entanglement_slow = ____exports.modifier_sai_snake_entanglement_slow
modifier_sai_snake_entanglement_slow.name = "modifier_sai_snake_entanglement_slow"
__TS__ClassExtends(modifier_sai_snake_entanglement_slow, BaseModifier)
function modifier_sai_snake_entanglement_slow.prototype.OnCreated(self, params)
    local ability = self:GetAbility()
    local interval = ability:GetSpecialValueFor("slow_growth_interval")
    self.turn_slow = -ability:GetSpecialValueFor("turn_slow")
    self.move_slow_per_sec = -ability:GetSpecialValueFor("move_slow_per_sec") * interval
    self.max_move_slow = -ability:GetSpecialValueFor("max_move_slow")
    self.damage = (ability:GetSpecialValueFor("damage_per_sec") + self:GetCaster():FindTalentValue("special_bonus_sai_2")) * interval
    self.current_move_slow = self.move_slow_per_sec
    if not IsServer() then
        return
    end
    self.damage_table = {
        attacker = self:GetCaster(),
        victim = self:GetParent(),
        damage = self.damage,
        damage_type = DAMAGE_TYPE_MAGICAL,
        ability = ability
    }
    local innate = self:GetCaster():FindAbilityByName("sai_innate_passive")
    if innate then
        innate:ApplyDebuff(self:GetParent())
    end
    self:StartIntervalThink(interval)
    self:OnIntervalThink()
end
function modifier_sai_snake_entanglement_slow.prototype.OnIntervalThink(self)
    ApplyDamage(self.damage_table)
end
function modifier_sai_snake_entanglement_slow.prototype.OnRefresh(self, params)
    self.current_move_slow = math.max(self.current_move_slow + self.move_slow_per_sec, self.max_move_slow)
    if not IsServer() then
        return
    end
    local innate = self:GetCaster():FindAbilityByName("sai_innate_passive")
    if innate then
        innate:ApplyDebuff(self:GetParent())
    end
end
function modifier_sai_snake_entanglement_slow.prototype.DeclareFunctions(self)
    return {MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE, MODIFIER_PROPERTY_TURN_RATE_PERCENTAGE}
end
function modifier_sai_snake_entanglement_slow.prototype.GetModifierMoveSpeedBonus_Percentage(self)
    return self.current_move_slow
end
function modifier_sai_snake_entanglement_slow.prototype.GetModifierTurnRate_Percentage(self)
    return self.turn_slow
end
function modifier_sai_snake_entanglement_slow.prototype.GetEffectName(self)
    return "particles/units/heroes/hero_batrider/batrider_stickynapalm_debuff.vpcf"
end
function modifier_sai_snake_entanglement_slow.prototype.GetEffectAttachType(self)
    return PATTACH_ABSORIGIN_FOLLOW
end
modifier_sai_snake_entanglement_slow = __TS__Decorate(
    {registerModifier(nil)},
    modifier_sai_snake_entanglement_slow
)
____exports.modifier_sai_snake_entanglement_slow = modifier_sai_snake_entanglement_slow
return ____exports
