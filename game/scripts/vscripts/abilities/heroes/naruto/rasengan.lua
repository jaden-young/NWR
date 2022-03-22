LinkLuaModifier("modifier_naruto_rasengan", "abilities/heroes/naruto/rasengan", LUA_MODIFIER_MOTION_NONE)
LinkLuaModifier("modifier_naruto_rasengan_slow", "abilities/heroes/naruto/rasengan", LUA_MODIFIER_MOTION_NONE)

naruto_rasengan = naruto_rasengan or class({})

function naruto_rasengan:Precache( context )
	PrecacheResource( "soundfile", "soundevents/heroes/naruto/rasengan_cast.vsndevts", context )
	PrecacheResource( "soundfile", "soundevents/heroes/naruto/rasengan_charged.vsndevts", context )
	PrecacheResource( "soundfile", "soundevents/heroes/naruto/rasengan_impact.vsndevts", context )
	PrecacheResource( "soundfile", "soundevents/heroes/naruto/rasengan_talking.vsndevts", context )

    PrecacheResource( "particle",  "particles/units/heroes/yondaime/raseng_impact.vpcf", context )
end

function naruto_rasengan:OnUpgrade()
	local ability = self:GetCaster():FindAbilityByName("naruto_rasenshuriken")

	if ability then
		ability:SetLevel(self:GetLevel())
	end
end

function naruto_rasengan:OnAbilityPhaseStart()
	local caster = self:GetCaster()
	caster:EmitSound("rasengan_cast")
	return true
end

function naruto_rasengan:OnSpellStart()
	if not IsServer() then return end

	self:GetCaster():AddNewModifier(self:GetCaster(), self, "modifier_naruto_rasengan", {duration = self:GetSpecialValueFor("duration")})
	self:GetCaster():EmitSound("rasengan_charged")
end

modifier_naruto_rasengan = modifier_naruto_rasengan or class({})

function modifier_naruto_rasengan:DeclareFunctions() return {
	MODIFIER_EVENT_ON_ATTACK_LANDED,
} end

function modifier_naruto_rasengan:OnAttackLanded( keys )
	if keys.attacker ~= self:GetParent() then return end
	if keys.target:IsMagicImmune() then return end

	keys.target:EmitSound("rasengan_impact")
	keys.attacker:EmitSound("rasengan_talking")
	keys.attacker:StopSound("rasengan_charged")
	
	keys.target:AddNewModifier(self:GetParent(), self:GetAbility(), "modifier_naruto_rasengan_slow", { duration = self:GetAbility():GetSpecialValueFor("knockback_duration") + self:GetAbility():GetSpecialValueFor("slow_duration")})

	local damage = self:GetAbility():GetSpecialValueFor("damage") + self:GetParent():FindTalentValue("special_bonus_naruto_4")

	ApplyDamage({
		victim 			= keys.target,
		damage 			= damage,
		damage_type		= self:GetAbility():GetAbilityDamageType(),
		damage_flags 	= self:GetAbility():GetAbilityTargetFlags(),
		attacker 		= self:GetParent(),
		ability 		= self:GetAbility()
	})

	SendOverheadEventMessage(nil, OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, keys.target, damage, nil)

	self:Destroy()
end

modifier_naruto_rasengan_slow = modifier_naruto_rasengan_slow or class({})

function modifier_naruto_rasengan_slow:DeclareFunctions() return {
	MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
} end

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

function modifier_naruto_rasengan:OnIntervalThink()
	self.slow = self:GetAbility():GetVanillaAbilitySpecial("slow")
end

function modifier_naruto_rasengan_slow:GetModifierMoveSpeedBonus_Percentage()
	if self.slow then
		return self.slow * (-1)
	end
end