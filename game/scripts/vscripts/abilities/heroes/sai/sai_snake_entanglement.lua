local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__Decorate = ____lualib.__TS__Decorate
local __TS__ArrayForEach = ____lualib.__TS__ArrayForEach
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["9"] = 1,["10"] = 1,["11"] = 1,["12"] = 1,["13"] = 1,["14"] = 14,["15"] = 15,["16"] = 14,["17"] = 15,["18"] = 17,["19"] = 18,["20"] = 19,["21"] = 20,["22"] = 21,["23"] = 17,["24"] = 27,["25"] = 28,["26"] = 27,["27"] = 33,["28"] = 34,["29"] = 34,["30"] = 34,["31"] = 34,["32"] = 35,["33"] = 33,["34"] = 40,["35"] = 41,["36"] = 42,["37"] = 43,["38"] = 44,["39"] = 45,["40"] = 40,["41"] = 51,["42"] = 52,["43"] = 52,["44"] = 52,["45"] = 52,["46"] = 52,["47"] = 53,["48"] = 55,["49"] = 55,["51"] = 51,["52"] = 60,["53"] = 61,["54"] = 62,["55"] = 63,["56"] = 65,["57"] = 67,["58"] = 67,["59"] = 67,["60"] = 67,["61"] = 67,["62"] = 67,["63"] = 67,["64"] = 67,["65"] = 68,["66"] = 69,["67"] = 70,["68"] = 72,["69"] = 75,["70"] = 75,["71"] = 75,["72"] = 75,["73"] = 75,["74"] = 75,["75"] = 75,["76"] = 82,["77"] = 82,["78"] = 82,["79"] = 75,["80"] = 75,["81"] = 60,["82"] = 91,["83"] = 92,["84"] = 93,["85"] = 94,["86"] = 95,["87"] = 97,["88"] = 97,["89"] = 97,["90"] = 97,["91"] = 97,["92"] = 97,["93"] = 97,["94"] = 97,["95"] = 97,["96"] = 91,["97"] = 112,["98"] = 113,["101"] = 114,["102"] = 115,["103"] = 115,["104"] = 115,["106"] = 112,["107"] = 120,["108"] = 121,["109"] = 123,["110"] = 124,["111"] = 125,["112"] = 125,["115"] = 130,["116"] = 131,["117"] = 131,["118"] = 131,["119"] = 131,["120"] = 131,["121"] = 131,["122"] = 131,["123"] = 131,["124"] = 131,["125"] = 132,["126"] = 134,["127"] = 135,["128"] = 135,["129"] = 135,["130"] = 135,["131"] = 135,["132"] = 136,["134"] = 120,["135"] = 15,["136"] = 14,["137"] = 15,["139"] = 15,["140"] = 141,["141"] = 142,["142"] = 141,["143"] = 142,["145"] = 142,["146"] = 144,["147"] = 141,["148"] = 149,["149"] = 150,["152"] = 151,["153"] = 152,["154"] = 153,["155"] = 153,["156"] = 153,["157"] = 153,["158"] = 154,["159"] = 156,["160"] = 157,["161"] = 159,["162"] = 160,["163"] = 161,["164"] = 161,["165"] = 161,["166"] = 161,["167"] = 161,["168"] = 162,["169"] = 162,["170"] = 162,["171"] = 162,["172"] = 162,["173"] = 162,["174"] = 162,["175"] = 162,["176"] = 162,["177"] = 163,["178"] = 163,["179"] = 163,["180"] = 163,["181"] = 163,["182"] = 163,["183"] = 163,["184"] = 163,["185"] = 165,["186"] = 166,["187"] = 166,["188"] = 166,["189"] = 166,["190"] = 166,["191"] = 167,["192"] = 167,["193"] = 167,["194"] = 167,["195"] = 167,["196"] = 167,["197"] = 167,["198"] = 167,["199"] = 169,["200"] = 170,["201"] = 149,["202"] = 173,["203"] = 174,["204"] = 176,["205"] = 176,["206"] = 176,["207"] = 176,["208"] = 176,["209"] = 176,["210"] = 176,["211"] = 176,["212"] = 176,["213"] = 176,["214"] = 176,["215"] = 186,["216"] = 186,["217"] = 186,["218"] = 187,["219"] = 187,["220"] = 187,["221"] = 187,["222"] = 187,["223"] = 187,["224"] = 186,["225"] = 186,["226"] = 173,["227"] = 142,["228"] = 141,["229"] = 142,["231"] = 142,["232"] = 193,["233"] = 194,["234"] = 193,["235"] = 194,["236"] = 205,["237"] = 206,["238"] = 207,["239"] = 209,["240"] = 210,["241"] = 211,["242"] = 212,["243"] = 214,["244"] = 216,["247"] = 218,["248"] = 218,["249"] = 218,["250"] = 218,["251"] = 218,["252"] = 218,["253"] = 218,["254"] = 226,["255"] = 227,["256"] = 227,["258"] = 229,["259"] = 230,["260"] = 231,["262"] = 205,["263"] = 235,["264"] = 236,["265"] = 235,["266"] = 241,["267"] = 242,["268"] = 244,["271"] = 246,["272"] = 247,["273"] = 247,["275"] = 241,["276"] = 252,["277"] = 252,["278"] = 252,["279"] = 259,["280"] = 260,["281"] = 259,["282"] = 265,["283"] = 266,["284"] = 265,["285"] = 271,["286"] = 272,["287"] = 271,["288"] = 277,["289"] = 278,["290"] = 277,["291"] = 194,["292"] = 193,["293"] = 194,["295"] = 194,["296"] = 282,["297"] = 283,["298"] = 282,["299"] = 283,["300"] = 285,["301"] = 286,["302"] = 286,["303"] = 286,["304"] = 286,["305"] = 286,["306"] = 286,["307"] = 286,["308"] = 285,["309"] = 283,["310"] = 282,["311"] = 283,["313"] = 283});
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
    PrecacheResource("particle", "particles/units/heroes/sai/sai_snake_entanglement.vpcf", context)
    PrecacheResource("particle", "particles/units/heroes/sai/sai_snake_entanglement_pit.vpcf", context)
    PrecacheResource("particle", "particles/units/heroes/sai/sai_snake_entanglement_impact.vpcf", context)
    PrecacheResource("soundfile", "soundevents/heroes/sai/game_sounds_sai.vsndevts", context)
end
function sai_snake_entanglement.prototype.GetAOERadius(self)
    return self:GetSpecialValueFor("radius")
end
function sai_snake_entanglement.prototype.OnAbilityPhaseStart(self)
    EmitSoundOn(
        "Hero_Sai.SnakeEntanglement.PreCast",
        self:GetCaster()
    )
    return true
end
function sai_snake_entanglement.prototype.OnSpellStart(self)
    local position = self:GetCursorPosition()
    local projectiles = self:GetSpecialValueFor("snake_projectiles")
    local duration = self:GetSpecialValueFor("snake_speed") / (position - self:GetCaster():GetAbsOrigin()):Length2D()
    self:InitiateLaunch(position, projectiles, duration)
    self:LaunchMainSnake(position)
end
function sai_snake_entanglement.prototype.InitiateLaunch(self, position, count, duration)
    self:LaunchSnake(
        position + RandomVector(self:GetSpecialValueFor("radius") / 2),
        duration,
        false
    )
    count = count - 1
    if count > 0 then
        self:InitiateLaunch(position, count, duration)
    end
end
function sai_snake_entanglement.prototype.LaunchSnake(self, position, duration, create_puddle)
    local caster = self:GetCaster()
    local direction = (position - caster:GetAbsOrigin()):Normalized()
    local speed = create_puddle and self:GetSpecialValueFor("snake_speed") or (position - caster:GetAbsOrigin()):Length2D() * duration
    local spawn_pos = caster:GetAttachmentOrigin(caster:ScriptLookupAttachment("attach_scroll_center")) + direction * 75 + caster:GetRightVector() * 40
    local snake = CreateUnitByName(
        "npc_dota_sai_snake",
        spawn_pos,
        false,
        nil,
        nil,
        caster:GetTeamNumber()
    )
    snake:AddNewModifier(caster, self, "modifier_sai_snake_entanglement_snake", {duration = -1})
    snake:SetForwardVector((position - caster:GetAbsOrigin()):Normalized())
    snake:StartGesture(ACT_DOTA_AMBUSH)
    EmitSoundOn("Hero_Sai.SnakeEntanglement.Cast", snake)
    ProjectileManager:CreateLinearProjectile({
        Ability = self,
        EffectName = "",
        vSpawnOrigin = spawn_pos,
        fDistance = (spawn_pos - position):Length2D(),
        Source = caster,
        vVelocity = direction * speed,
        ExtraData = {
            snake_eid = snake:entindex(),
            create_puddle = create_puddle
        }
    })
end
function sai_snake_entanglement.prototype.LaunchMainSnake(self, position)
    local caster = self:GetCaster()
    local direction = (position - caster:GetAbsOrigin()):Normalized()
    local speed = self:GetSpecialValueFor("snake_speed")
    local spawn_pos = caster:GetAttachmentOrigin(caster:ScriptLookupAttachment("attach_scroll_center")) + direction * 75 + caster:GetRightVector() * 40
    ProjectileManager:CreateLinearProjectile({
        Ability = self,
        EffectName = "",
        vSpawnOrigin = spawn_pos,
        fDistance = (spawn_pos - position):Length2D(),
        Source = caster,
        vVelocity = direction * speed,
        ExtraData = {create_puddle = true}
    })
end
function sai_snake_entanglement.prototype.OnProjectileThink_ExtraData(self, location, extraData)
    if not extraData.snake_eid then
        return
    end
    local snake = EntIndexToHScript(extraData.snake_eid)
    local ____snake_SetAbsOrigin_result_0 = snake
    if ____snake_SetAbsOrigin_result_0 ~= nil then
        ____snake_SetAbsOrigin_result_0 = ____snake_SetAbsOrigin_result_0:SetAbsOrigin(GetGroundPosition(location, snake) + Vector(0, 0, 75))
    end
end
function sai_snake_entanglement.prototype.OnProjectileHit_ExtraData(self, target, location, extraData)
    local caster = self:GetCaster()
    if extraData.snake_eid then
        local snake = EntIndexToHScript(extraData.snake_eid)
        if snake then
            UTIL_Remove(snake)
        end
    end
    if extraData.create_puddle == 1 then
        CreateModifierThinker(
            caster,
            self,
            "modifier_sai_snake_entanglement",
            {duration = self:GetSpecialValueFor("duration")},
            location,
            caster:GetTeamNumber(),
            false
        )
        EmitSoundOnLocationWithCaster(location, "Hero_Sai.SnakeEntanglement.Impact", caster)
        local impact_fx = ParticleManager:CreateParticle("particles/units/heroes/sai/sai_snake_entanglement_impact.vpcf", PATTACH_CUSTOMORIGIN, nil)
        ParticleManager:SetParticleControl(
            impact_fx,
            1,
            GetGroundPosition(location, nil)
        )
        ParticleManager:ReleaseParticleIndex(impact_fx)
    end
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
    local parent = self:GetParent()
    local pos = GetGroundPosition(
        parent:GetAbsOrigin(),
        nil
    )
    pos.z = pos.z + 150
    self.radius = ability:GetSpecialValueFor("radius")
    self.debuff_duration = ability:GetSpecialValueFor("debuff_duration")
    local pit_fx = ParticleManager:CreateParticle("particles/units/heroes/sai/sai_snake_entanglement_pit.vpcf", PATTACH_ABSORIGIN, parent)
    ParticleManager:SetParticleControl(pit_fx, 0, pos)
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
    local area_fx = ParticleManager:CreateParticle("particles/units/heroes/sai/sai_snake_entanglement.vpcf", PATTACH_ABSORIGIN, parent)
    ParticleManager:SetParticleControl(
        area_fx,
        1,
        Vector(self.radius, 0, 0)
    )
    self:AddParticle(
        area_fx,
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
    if self.damage > 0 then
        self:StartIntervalThink(interval)
        self:OnIntervalThink()
    end
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
    return "particles/units/heroes/sai/sai_snake_entanglement_debuff.vpcf"
end
function modifier_sai_snake_entanglement_slow.prototype.GetEffectAttachType(self)
    return PATTACH_ABSORIGIN_FOLLOW
end
modifier_sai_snake_entanglement_slow = __TS__Decorate(
    {registerModifier(nil)},
    modifier_sai_snake_entanglement_slow
)
____exports.modifier_sai_snake_entanglement_slow = modifier_sai_snake_entanglement_slow
____exports.modifier_sai_snake_entanglement_snake = __TS__Class()
local modifier_sai_snake_entanglement_snake = ____exports.modifier_sai_snake_entanglement_snake
modifier_sai_snake_entanglement_snake.name = "modifier_sai_snake_entanglement_snake"
__TS__ClassExtends(modifier_sai_snake_entanglement_snake, BaseModifier)
function modifier_sai_snake_entanglement_snake.prototype.CheckState(self)
    return {
        [MODIFIER_STATE_NO_HEALTH_BAR] = true,
        [MODIFIER_STATE_DISARMED] = true,
        [MODIFIER_STATE_NOT_ON_MINIMAP] = true,
        [MODIFIER_STATE_OUT_OF_GAME] = true,
        [MODIFIER_STATE_INVULNERABLE] = true
    }
end
modifier_sai_snake_entanglement_snake = __TS__Decorate(
    {registerModifier(nil)},
    modifier_sai_snake_entanglement_snake
)
____exports.modifier_sai_snake_entanglement_snake = modifier_sai_snake_entanglement_snake
return ____exports
