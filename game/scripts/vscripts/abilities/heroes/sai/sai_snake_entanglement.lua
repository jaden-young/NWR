local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__Decorate = ____lualib.__TS__Decorate
local __TS__ArrayForEach = ____lualib.__TS__ArrayForEach
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["9"] = 1,["10"] = 1,["11"] = 1,["12"] = 1,["13"] = 1,["14"] = 14,["15"] = 15,["16"] = 14,["17"] = 15,["18"] = 17,["19"] = 18,["20"] = 19,["21"] = 20,["22"] = 21,["23"] = 17,["24"] = 27,["25"] = 28,["26"] = 27,["27"] = 33,["28"] = 34,["29"] = 35,["30"] = 36,["31"] = 37,["32"] = 38,["33"] = 33,["34"] = 44,["35"] = 45,["36"] = 45,["37"] = 45,["38"] = 45,["39"] = 45,["40"] = 46,["41"] = 48,["42"] = 48,["44"] = 44,["45"] = 53,["46"] = 54,["47"] = 55,["48"] = 56,["49"] = 58,["50"] = 60,["51"] = 60,["52"] = 60,["53"] = 60,["54"] = 60,["55"] = 60,["56"] = 60,["57"] = 60,["58"] = 61,["59"] = 62,["60"] = 63,["61"] = 65,["62"] = 68,["63"] = 68,["64"] = 68,["65"] = 68,["66"] = 68,["67"] = 68,["68"] = 68,["69"] = 75,["70"] = 75,["71"] = 75,["72"] = 68,["73"] = 68,["74"] = 53,["75"] = 84,["76"] = 85,["77"] = 86,["78"] = 87,["79"] = 88,["80"] = 90,["81"] = 90,["82"] = 90,["83"] = 90,["84"] = 90,["85"] = 90,["86"] = 90,["87"] = 90,["88"] = 90,["89"] = 84,["90"] = 105,["91"] = 106,["94"] = 107,["95"] = 108,["96"] = 108,["97"] = 108,["99"] = 105,["100"] = 113,["101"] = 114,["102"] = 116,["103"] = 117,["104"] = 118,["105"] = 118,["108"] = 123,["109"] = 124,["110"] = 124,["111"] = 124,["112"] = 124,["113"] = 124,["114"] = 124,["115"] = 124,["116"] = 124,["117"] = 124,["118"] = 125,["119"] = 127,["120"] = 128,["121"] = 128,["122"] = 128,["123"] = 128,["124"] = 128,["125"] = 129,["127"] = 113,["128"] = 15,["129"] = 14,["130"] = 15,["132"] = 15,["133"] = 134,["134"] = 135,["135"] = 134,["136"] = 135,["138"] = 135,["139"] = 137,["140"] = 134,["141"] = 142,["142"] = 143,["145"] = 144,["146"] = 145,["147"] = 146,["148"] = 146,["149"] = 146,["150"] = 146,["151"] = 147,["152"] = 149,["153"] = 150,["154"] = 152,["155"] = 153,["156"] = 154,["157"] = 154,["158"] = 154,["159"] = 154,["160"] = 154,["161"] = 155,["162"] = 155,["163"] = 155,["164"] = 155,["165"] = 155,["166"] = 155,["167"] = 155,["168"] = 155,["169"] = 155,["170"] = 156,["171"] = 156,["172"] = 156,["173"] = 156,["174"] = 156,["175"] = 156,["176"] = 156,["177"] = 156,["178"] = 158,["179"] = 159,["180"] = 159,["181"] = 159,["182"] = 159,["183"] = 159,["184"] = 160,["185"] = 160,["186"] = 160,["187"] = 160,["188"] = 160,["189"] = 160,["190"] = 160,["191"] = 160,["192"] = 162,["193"] = 163,["194"] = 142,["195"] = 166,["196"] = 167,["197"] = 169,["198"] = 169,["199"] = 169,["200"] = 169,["201"] = 169,["202"] = 169,["203"] = 169,["204"] = 169,["205"] = 169,["206"] = 169,["207"] = 169,["208"] = 179,["209"] = 179,["210"] = 179,["211"] = 180,["212"] = 180,["213"] = 180,["214"] = 180,["215"] = 180,["216"] = 180,["217"] = 179,["218"] = 179,["219"] = 166,["220"] = 135,["221"] = 134,["222"] = 135,["224"] = 135,["225"] = 186,["226"] = 187,["227"] = 186,["228"] = 187,["229"] = 198,["230"] = 199,["231"] = 200,["232"] = 202,["233"] = 203,["234"] = 204,["235"] = 205,["236"] = 207,["237"] = 209,["240"] = 211,["241"] = 211,["242"] = 211,["243"] = 211,["244"] = 211,["245"] = 211,["246"] = 211,["247"] = 219,["248"] = 220,["249"] = 220,["251"] = 222,["252"] = 223,["253"] = 224,["255"] = 198,["256"] = 228,["257"] = 229,["258"] = 228,["259"] = 234,["260"] = 235,["261"] = 237,["264"] = 239,["265"] = 240,["266"] = 240,["268"] = 234,["269"] = 245,["270"] = 245,["271"] = 245,["272"] = 252,["273"] = 253,["274"] = 252,["275"] = 258,["276"] = 259,["277"] = 258,["278"] = 264,["279"] = 265,["280"] = 264,["281"] = 270,["282"] = 271,["283"] = 270,["284"] = 187,["285"] = 186,["286"] = 187,["288"] = 187,["289"] = 275,["290"] = 276,["291"] = 275,["292"] = 276,["293"] = 278,["294"] = 279,["295"] = 279,["296"] = 279,["297"] = 279,["298"] = 279,["299"] = 279,["300"] = 279,["301"] = 278,["302"] = 276,["303"] = 275,["304"] = 276,["306"] = 276});
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
