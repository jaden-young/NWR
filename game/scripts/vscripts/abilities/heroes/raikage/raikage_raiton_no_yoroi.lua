LinkLuaModifier( "modifier_raikage_shield", 		"scripts/vscripts/abilities/heroes/raikage/raikage_raiton_no_yoroi.lua", LUA_MODIFIER_MOTION_NONE )
LinkLuaModifier( "modifier_raikage_shield_debuff", 	"scripts/vscripts/abilities/heroes/raikage/raikage_raiton_no_yoroi.lua", LUA_MODIFIER_MOTION_NONE )
----------------------------------------------------------------------------------------

raikage_raiton_no_yoroi = class({})

----------------------------------------------------------------------------------------

function raikage_raiton_no_yoroi:Precache( context )
    PrecacheResource( "soundfile",  "soundevents/heroes/raikage/raikage_lightningarmor_cast.vsndevts", context )
    PrecacheResource( "soundfile", "soundevents/heroes/raikage/raikage_lightningarmor_end.vsndevts", context )

    PrecacheResource( "particle", "particles/units/heroes/hero_razor/razor_ambient_g.vpcf", context )
    PrecacheResource( "particle", "particles/generic_gameplay/generic_purge.vpcf", context )
    PrecacheResource( "particle", "particles/econ/items/razor/razor_punctured_crest/razor_helmet_blade_ambient_a.vpcf", context )
	PrecacheResource( "particle",  "particles/units/heroes/raikage/shield_explosion.vpcf", context )
end

----------------------------------------------------------------------------------------

function raikage_raiton_no_yoroi:GetBehavior()
	return self.BaseClass.GetBehavior(self)
end

----------------------------------------------------------------------------------------

function raikage_raiton_no_yoroi:GetCooldown(iLevel)
   return self.BaseClass.GetCooldown(self, iLevel)
end

----------------------------------------------------------------------------------------

function raikage_raiton_no_yoroi:ProcsMagicStick()
   return true
end

----------------------------------------------------------------------------------------

function raikage_raiton_no_yoroi:OnToggle(destroy)
	local caster = self:GetCaster()

	if self:GetToggleState() then
		caster:AddNewModifier(caster, self, "modifier_raikage_shield", {duration = self:GetSpecialValueFor("duration")})
	else
		if caster:HasModifier("modifier_raikage_shield") then
			local modifier = caster:FindModifierByName("modifier_raikage_shield")
			modifier.manual_destruction = true
			modifier:Destroy()
		end
	end
end

----------------------------------------------------------------------------------------

modifier_raikage_shield = modifier_raikage_shield or class({})

----------------------------------------------------------------------------------------

function modifier_raikage_shield:IsBuff() return true end

----------------------------------------------------------------------------------------

function modifier_raikage_shield:OnCreated()
	self.ability = self:GetAbility()
	self.aoe = self.ability:GetSpecialValueFor("release_aoe")
	self.damage = self:GetParent():GetMaxHealth() * self.ability:GetSpecialValueFor("max_health_shield") / 100
	self.duration = self.ability:GetSpecialValueFor("release_purge_duration")

	self.shield = self.ability:GetSpecialValueFor("charge_damage_amount") + self:GetCaster():FindTalentValue("special_bonus_raikage_2")

   -- add shield particles
   if not IsServer() then return end
   self.ability = self:GetAbility()
   self.ability.pfx1 = ParticleManager:CreateParticle(  "particles/units/heroes/hero_razor/razor_ambient_g.vpcf", PATTACH_ABSORIGIN_FOLLOW, self:GetCaster() )
   ParticleManager:SetParticleControlEnt( self.ability.pfx1, 0, self:GetCaster(), PATTACH_ABSORIGIN_FOLLOW, "attach_leftelbow", self:GetCaster():GetAbsOrigin(), true )
   self.ability.pfx2 = ParticleManager:CreateParticle(  "particles/units/heroes/hero_razor/razor_ambient_g.vpcf", PATTACH_ABSORIGIN_FOLLOW, self:GetCaster() )
   ParticleManager:SetParticleControlEnt( self.ability.pfx2, 0, self:GetCaster(), PATTACH_ABSORIGIN_FOLLOW, "attach_rightelbow", self:GetCaster():GetAbsOrigin(), true )
   self.ability.pfx3 = ParticleManager:CreateParticle(  "particles/units/heroes/hero_razor/razor_ambient_g.vpcf", PATTACH_ABSORIGIN_FOLLOW, self:GetCaster() )
   ParticleManager:SetParticleControlEnt( self.ability.pfx3, 0, self:GetCaster(), PATTACH_ABSORIGIN_FOLLOW, "attach_leftshoulder", self:GetCaster():GetAbsOrigin(), true )
   self.ability.pfx4 = ParticleManager:CreateParticle(  "particles/units/heroes/hero_razor/razor_ambient_g.vpcf", PATTACH_ABSORIGIN_FOLLOW, self:GetCaster() )
   ParticleManager:SetParticleControlEnt( self.ability.pfx4, 0, self:GetCaster(), PATTACH_ABSORIGIN_FOLLOW, "attach_rightshoulder", self:GetCaster():GetAbsOrigin(), true )
   self.ability.pfx5 = ParticleManager:CreateParticle(  "particles/units/heroes/hero_razor/razor_ambient_g.vpcf", PATTACH_ABSORIGIN_FOLLOW, self:GetCaster() )
   ParticleManager:SetParticleControlEnt( self.ability.pfx5, 0, self:GetCaster(), PATTACH_ABSORIGIN_FOLLOW, "attach_rightleg", self:GetCaster():GetAbsOrigin(), true )
   self.ability.pfx6 = ParticleManager:CreateParticle(  "particles/units/heroes/hero_razor/razor_ambient_g.vpcf", PATTACH_ABSORIGIN_FOLLOW, self:GetCaster() )
   ParticleManager:SetParticleControlEnt( self.ability.pfx6, 0, self:GetCaster(), PATTACH_ABSORIGIN_FOLLOW, "attach_leftleg", self:GetCaster():GetAbsOrigin(), true )
   self.ability.pfx7 = ParticleManager:CreateParticle(  "particles/units/heroes/hero_razor/razor_ambient_g.vpcf", PATTACH_ABSORIGIN_FOLLOW, self:GetCaster() )
   ParticleManager:SetParticleControlEnt( self.ability.pfx7, 0, self:GetCaster(), PATTACH_ABSORIGIN_FOLLOW, "attach_lefthand", self:GetCaster():GetAbsOrigin(), true )
   self.ability.pfx8 = ParticleManager:CreateParticle(  "particles/units/heroes/hero_razor/razor_ambient_g.vpcf", PATTACH_ABSORIGIN_FOLLOW, self:GetCaster() )
   ParticleManager:SetParticleControlEnt( self.ability.pfx8, 0, self:GetCaster(), PATTACH_ABSORIGIN_FOLLOW, "attach_righthand", self:GetCaster():GetAbsOrigin(), true )

   EmitSoundOn("raikage_lightningarmor_cast", self:GetCaster())

   self:GetCaster():Purge(false, true, false, false, false)
end

----------------------------------------------------------------------------------------

function modifier_raikage_shield:OnDestroy(manual)
	if not IsServer() then return end
	ParticleManager:DestroyParticle(self.ability.pfx1, true)
	ParticleManager:DestroyParticle(self.ability.pfx2, true)
	ParticleManager:DestroyParticle(self.ability.pfx3, true)
	ParticleManager:DestroyParticle(self.ability.pfx4, true)
	ParticleManager:DestroyParticle(self.ability.pfx5, true)
	ParticleManager:DestroyParticle(self.ability.pfx6, true)
	ParticleManager:DestroyParticle(self.ability.pfx7, true)
	ParticleManager:DestroyParticle(self.ability.pfx8, true)
	
	self:GetCaster():StopSound("raikage_lightningarmor_cast")

	EmitSoundOn("raikage_lightningarmor_end", self:GetCaster())

	if not self.manual_destruction then
		self:GetAbility():ToggleAbility()
	end

	self:Release()	
end

----------------------------------------------------------------------------------------

function modifier_raikage_shield:DeclareFunctions()
	return {MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK}
end

----------------------------------------------------------------------------------------
 
function modifier_raikage_shield:GetModifierTotal_ConstantBlock(keys)
	if (self:GetStackCount() + keys.damage) < self.shield then
		self:SetStackCount(self:GetStackCount() + keys.damage)
	else
		self:Destroy()
		return keys.damage  - (self.shield - self:GetStackCount())
	end

	return keys.damage
end

----------------------------------------------------------------------------------------

function modifier_raikage_shield:Release()
	local ability = self:GetAbility()
	local caster = ability:GetCaster()
	local radius = ability:GetSpecialValueFor("release_aoe")

	local release_fx = ParticleManager:CreateParticle("particles/units/heroes/raikage/shield_explosion.vpcf", PATTACH_ABSORIGIN_FOLLOW, caster)
	ParticleManager:SetParticleControl(release_fx, 0, caster:GetAbsOrigin())
	ParticleManager:SetParticleControl(release_fx, 3, Vector(radius, 0, 0))
	ParticleManager:ReleaseParticleIndex(release_fx)

	self:applyAoeDamageSlow(caster, radius, ability:GetSpecialValueFor("release_damage"), ability:GetSpecialValueFor("release_purge_duration"), ability)
end

----------------------------------------------------------------------------------------

function modifier_raikage_shield:applyAoeDamageSlow(caster, aoe, damage, slow_duration, ability)
	local targetEntities = FindUnitsInRadius(
		caster:GetTeamNumber(), 
		caster:GetAbsOrigin(), 
		nil,
		aoe, 
		DOTA_UNIT_TARGET_TEAM_ENEMY, 
		DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_BASIC, 
		0, 
		0, 
		false
	)

	for _,oneTarget in pairs(targetEntities) do

		--apply damage
		ApplyDamage({
			victim = oneTarget,
			attacker = caster,
			damage = damage,
			damage_type = DAMAGE_TYPE_MAGICAL
		})
	
		--apply modifier slow
		oneTarget:AddNewModifier(caster, ability, "modifier_raikage_shield_debuff", {duration = slow_duration})

		--apply effect on caster
		local purge_target_particle = ParticleManager:CreateParticle("particles/generic_gameplay/generic_purge.vpcf", PATTACH_ABSORIGIN, oneTarget)
		ParticleManager:SetParticleControlEnt(purge_target_particle, 0, oneTarget, PATTACH_ABSORIGIN, "attach_hitloc", oneTarget:GetAbsOrigin(), false)
		
	end
end

----------------------------------------------------------------------------------------

modifier_raikage_shield_debuff = modifier_raikage_shield_debuff or class({})

----------------------------------------------------------------------------------------

function modifier_raikage_shield_debuff:OnCreated()
	self.slow = self:GetAbility():GetSpecialValueFor("release_ms_slow")
end

----------------------------------------------------------------------------------------

function modifier_raikage_shield_debuff:IsHidden() return false end
function modifier_raikage_shield_debuff:IsDebuff() return true end

----------------------------------------------------------------------------------------

function modifier_raikage_shield_debuff:DeclareFunctions()
   return {MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE}
end

----------------------------------------------------------------------------------------

function modifier_raikage_shield_debuff:GetModifierMoveSpeedBonus_Percentage()
    return  self.slow
end