LinkLuaModifier("modifier_naruto_rasengan", 		"abilities/heroes/naruto/rasengan", LUA_MODIFIER_MOTION_NONE)
LinkLuaModifier("modifier_naruto_rasengan_slow", 	"abilities/heroes/naruto/rasengan", LUA_MODIFIER_MOTION_NONE)
--------------------------------------------------------------------------------

naruto_rasengan = naruto_rasengan or class({})

--------------------------------------------------------------------------------

function naruto_rasengan:Precache( context )
	PrecacheResource( "soundfile", "soundevents/heroes/naruto/rasengan_cast.vsndevts", context )
	PrecacheResource( "soundfile", "soundevents/heroes/naruto/rasengan_charged.vsndevts", context )
	PrecacheResource( "soundfile", "soundevents/heroes/naruto/rasengan_impact.vsndevts", context )
	PrecacheResource( "soundfile", "soundevents/heroes/naruto/rasengan_talking.vsndevts", context )
	PrecacheResource("particle", "particles/units/heroes/naruto/rasengan_wip.vpcf", context)
    PrecacheResource( "particle",  "particles/units/heroes/yondaime/raseng_impact.vpcf", context )
end

--------------------------------------------------------------------------------

function naruto_rasengan:GetBehavior()
	if self:GetCaster():HasModifier("modifier_kyuubi_chakra_mode_active") then
		return DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR_IMMEDIATE
	else
		return self.BaseClass.GetBehavior(self)
	end
end

--------------------------------------------------------------------------------

function naruto_rasengan:OnAbilityPhaseStart()
	local caster = self:GetCaster()
	caster:EmitSound("rasengan_cast")

	self.rasengan_fx = ParticleManager:CreateParticle("particles/units/heroes/naruto/rasengan_wip.vpcf", PATTACH_ABSORIGIN, caster)
	ParticleManager:SetParticleControlEnt(self.rasengan_fx, 0, caster, PATTACH_POINT_FOLLOW, "attach_attack1", Vector(0, 0, 0), true)
	ParticleManager:SetParticleControlEnt(self.rasengan_fx, 1, caster, PATTACH_POINT_FOLLOW, "attach_attack1", Vector(0, 0, 0), true)
	ParticleManager:SetParticleControlEnt(self.rasengan_fx, 3, caster, PATTACH_POINT_FOLLOW, "attach_attack1", Vector(0, 0, 0), true)


	return true
end

--------------------------------------------------------------------------------

function naruto_rasengan:OnAbilityPhaseInterrupted()
	ParticleManager:DestroyParticle(self.rasengan_fx, true)
	ParticleManager:ReleaseParticleIndex(self.rasengan_fx)
end

--------------------------------------------------------------------------------

function naruto_rasengan:OnSpellStart()
	if not IsServer() then return end
	local caster = self:GetCaster()

	local modifier =  caster:AddNewModifier(caster, self, "modifier_naruto_rasengan", {duration = self:GetSpecialValueFor("duration")})

	caster:EmitSound("rasengan_charged")

	if not self.rasengan_fx then
		self.rasengan_fx = ParticleManager:CreateParticle("particles/units/heroes/naruto/rasengan_wip.vpcf", PATTACH_ABSORIGIN, caster)
		ParticleManager:SetParticleControlEnt(self.rasengan_fx, 0, caster, PATTACH_POINT_FOLLOW, "attach_attack1", Vector(0, 0, 0), true)
		ParticleManager:SetParticleControlEnt(self.rasengan_fx, 1, caster, PATTACH_POINT_FOLLOW, "attach_attack1", Vector(0, 0, 0), true)
		ParticleManager:SetParticleControlEnt(self.rasengan_fx, 3, caster, PATTACH_POINT_FOLLOW, "attach_attack1", Vector(0, 0, 0), true)
	end

	modifier:AddParticle(self.rasengan_fx, false, false, -1, false, false)
	self.rasengan_fx = nil
end

--------------------------------------------------------------------------------

function naruto_rasengan:ActivateRasengan(unit)
	local modifier = unit:AddNewModifier(self:GetCaster(), self, "modifier_naruto_rasengan", {duration = self:GetSpecialValueFor("duration")})
	EmitSoundOn("rasengan_charged", unit)

	local rasengan_fx = ParticleManager:CreateParticle("particles/units/heroes/naruto/rasengan_clone.vpcf", PATTACH_ABSORIGIN, unit)
	ParticleManager:SetParticleControlEnt(rasengan_fx, 0, unit, PATTACH_POINT_FOLLOW, "attach_attack1", Vector(0, 0, 0), true)
	ParticleManager:SetParticleControlEnt(rasengan_fx, 1, unit, PATTACH_POINT_FOLLOW, "attach_attack1", Vector(0, 0, 0), true)
	ParticleManager:SetParticleControlEnt(rasengan_fx, 3, unit, PATTACH_POINT_FOLLOW, "attach_attack1", Vector(0, 0, 0), true)

	modifier:AddParticle(rasengan_fx, false, false, -1, false, false)
end

--------------------------------------------------------------------------------

modifier_naruto_rasengan = modifier_naruto_rasengan or class({})

function modifier_naruto_rasengan:OnCreated()
	if not IsServer() then return end
	local parent = self:GetParent()
	local clone_ability = parent:FindAbilityByName("naruto_shadow_clone_technique")

	if clone_ability and not parent:HasShard() then
		clone_ability:SetActivated(false)
	end
end

function modifier_naruto_rasengan:OnDestroy()
	if not IsServer() then return end
	local clone_ability = self:GetParent():FindAbilityByName("naruto_shadow_clone_technique")

	if clone_ability then
		clone_ability:SetActivated(true)
	end
end

--------------------------------------------------------------------------------

function modifier_naruto_rasengan:DeclareFunctions()
	return {
		MODIFIER_PROPERTY_PRE_ATTACK,
        MODIFIER_EVENT_ON_ATTACK_CANCELLED,
		MODIFIER_EVENT_ON_ATTACK_LANDED,
		MODIFIER_PROPERTY_TRANSLATE_ACTIVITY_MODIFIERS
	}
end

--------------------------------------------------------------------------------

function modifier_naruto_rasengan:GetModifierPreAttack(event)
    if not IsServer() then return 0 end

    local attacker = event.attacker
    local target = event.target
    local ability = self:GetAbility()

    if not attacker or not target or not ability or attacker ~= self:GetParent() or not attacker:IsRealHero() then
        return 0
    end


    self.record = event.record
	
	EmitSoundOn("rasengan_talking", attacker)

    return 0
end

--------------------------------------------------------------------------------

function modifier_naruto_rasengan:OnAttackCancelled(event)
	if not IsServer() then return end

    if event.record == self.record then
        StopSoundOn("rasengan_talking", event.attacker)
    end
end

--------------------------------------------------------------------------------

function modifier_naruto_rasengan:OnAttackLanded( keys )
	if not IsServer() then return end
	local attacker = keys.attacker
	local target = keys.target
	local ability = self:GetAbility()

	if not attacker or attacker ~= self:GetParent() or not target or target:IsMagicImmune() or not ability then
		return
	end

	target:EmitSound("rasengan_impact")
	attacker:StopSound("rasengan_charged")
	
	if not attacker:IsIllusion() then
		target:AddNewModifier(attacker, ability, "modifier_naruto_rasengan_slow", { duration = ability:GetSpecialValueFor("knockback_duration") + ability:GetSpecialValueFor("slow_duration")})
	end

	local damage = ability:GetSpecialValueFor("damage") + attacker:FindTalentValue("special_bonus_naruto_4")

	if attacker:IsIllusion() then
		damage = ability:GetSpecialValueFor("clone_damage")
	end

	ApplyDamage({
		victim 			= target,
		damage 			= damage,
		damage_type		= ability:GetAbilityDamageType(),
		damage_flags 	= ability:GetAbilityTargetFlags(),
		attacker 		= attacker,
		ability 		= ability
	})

	SendOverheadEventMessage(nil, OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, target, damage, nil)

	local impact_fx = ParticleManager:CreateParticle("particles/units/heroes/yondaime/raseng_impact.vpcf", PATTACH_ABSORIGIN_FOLLOW, target) 
	ParticleManager:SetParticleControlEnt(impact_fx, 0, target, PATTACH_POINT_FOLLOW, "attach_hitloc", target:GetAbsOrigin(), true)
	ParticleManager:SetParticleControlEnt(impact_fx, 2, target, PATTACH_POINT_FOLLOW, "attach_hitloc", target:GetAbsOrigin(), true)
	ParticleManager:SetParticleControlEnt(impact_fx, 3, target, PATTACH_POINT_FOLLOW, "attach_hitloc", target:GetAbsOrigin(), true)

	self:Destroy()
end

--------------------------------------------------------------------------------

function modifier_naruto_rasengan:GetActivityTranslationModifiers()
	return "rasengan"
end

--------------------------------------------------------------------------------

modifier_naruto_rasengan_slow = modifier_naruto_rasengan_slow or class({})

--------------------------------------------------------------------------------

function modifier_naruto_rasengan_slow:DeclareFunctions() return {
	MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
} end

--------------------------------------------------------------------------------

function modifier_naruto_rasengan_slow:OnCreated()
	self.slow = 0

	if not IsServer() then return end

	local direction = (self:GetCaster():GetAbsOrigin() - self:GetParent():GetAbsOrigin()):Normalized()
	local knockback_pos = self:GetParent():GetAbsOrigin() + direction * self:GetAbility():GetSpecialValueFor("knockback_distance")

	self:GetParent():RemoveModifierByName("modifier_knockback")

	self:GetParent():AddNewModifier(self:GetParent(), nil, "modifier_knockback", {
		should_stun = 1,
		knockback_duration = self:GetAbility():GetSpecialValueFor("knockback_duration"),
		duration = self:GetAbility():GetSpecialValueFor("knockback_duration"),
		knockback_distance = self:GetAbility():GetSpecialValueFor("knockback_distance"),
		knockback_height = 0,
		center_x = knockback_pos.x,
		center_y = knockback_pos.y,
		center_z = knockback_pos.z
	})

	self:StartIntervalThink(self:GetAbility():GetSpecialValueFor("knockback_duration"))
end

--------------------------------------------------------------------------------

function modifier_naruto_rasengan:OnIntervalThink()
	self.slow = self:GetAbility():GetVanillaAbilitySpecial("slow")
end

--------------------------------------------------------------------------------

function modifier_naruto_rasengan_slow:GetModifierMoveSpeedBonus_Percentage()
	if self.slow then
		return self.slow * (-1)
	end
end