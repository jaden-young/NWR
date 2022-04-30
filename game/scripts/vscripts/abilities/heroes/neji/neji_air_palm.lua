LinkLuaModifier( "modifier_neji_air_palm_debuff", "scripts/vscripts/abilities/heroes/neji/neji_air_palm.lua", LUA_MODIFIER_MOTION_NONE )
----------------------------------------------------------------------------------------------------------------------------------------

neji_air_palm = class({})

---------------------------------------------------------------------------

function neji_air_palm:Precache( context )
	PrecacheResource( "soundfile",  "soundevents/heroes/neji/neji_air_palm_fire.vsndevts", context )
	PrecacheResource( "soundfile", "soundevents/heroes/neji/neji_air_palm_impact.vsndevts", context )
	
	PrecacheResource( "particle", "particles/units/heroes/haku/senbon.vpcf", context )
	PrecacheResource( "particle", "particles/units/heroes/neji/neji_w_debuff_a.vpcf", context )
end

---------------------------------------------------------------------------

function neji_air_palm:GetBehavior()
	return self.BaseClass.GetBehavior(self)
end

---------------------------------------------------------------------------

function neji_air_palm:GetCooldown(iLevel)
	return self.BaseClass.GetCooldown(self, iLevel)
end

---------------------------------------------------------------------------

function neji_air_palm:GetCastRange(location, target)
	local castrangebonus = 0
	local abilityS = self:GetCaster():FindAbilityByName("special_bonus_neji_3")
	if abilityS ~= nil then
		if abilityS:GetLevel() > 0 then
			castrangebonus = 450
		end
	end
	return self:GetSpecialValueFor("cast_range") + castrangebonus
end

---------------------------------------------------------------------------

function neji_air_palm:ProcsMagicStick()
	return true
end

---------------------------------------------------------------------------

function neji_air_palm:GetBehavior()
	if self:GetCaster():HasShard() then
		return DOTA_ABILITY_BEHAVIOR_POINT
	else
		return self.BaseClass.GetBehavior(self)
	end
end

---------------------------------------------------------------------------

function neji_air_palm:GetCastRange(vLocation, hTarget)
	if self:GetCaster():HasShard() then
		return self:GetSpecialValueFor("shard_range")
	else
		return self.BaseClass.GetCastRange(self, vLocation, hTarget)
	end
end

---------------------------------------------------------------------------

function neji_air_palm:OnSpellStart()
	local caster = self:GetCaster()
	caster:EmitSound("neji_air_palm_fire")

	if caster:HasShard() then self:LaunchLinearProjectile() else self:LaunchTrackingProjectile() end
end

---------------------------------------------------------------------------

function neji_air_palm:LaunchTrackingProjectile()
	local caster = self:GetCaster()
	local target = self:GetCursorTarget()
	
	ProjectileManager:CreateTrackingProjectile({
		Target 				= target,
		Source 				= caster,
		Ability 			= self,
		EffectName 			= "particles/units/heroes/neji/neji_air_palm_proj.vpcf",
		iMoveSpeed			= 2800,
		vSpawnOrigin 		= caster:GetAbsOrigin(),
		bDrawsOnMinimap 	= false,
		bDodgeable 			= true,
		bIsAttack 			= false,
		bVisibleToEnemies 	= true,
		bReplaceExisting 	= false,
		flExpireTime 		= GameRules:GetGameTime() + 10,
		bProvidesVision 	= true,
		iSourceAttachment 	= DOTA_PROJECTILE_ATTACHMENT_ATTACK_1,
		iVisionRadius 		= 0,
		iVisionTeamNumber 	= caster:GetTeamNumber()
	})
end

---------------------------------------------------------------------------

function neji_air_palm:LaunchLinearProjectile()
	local caster = self:GetCaster()
	local position = self:GetCursorPosition()
	local radius = self:GetSpecialValueFor("shard_radius")
	local direction = position - caster:GetAbsOrigin()

	direction.z = 0
	direction = direction:Normalized()	

	ProjectileManager:CreateLinearProjectile({
		Ability				= self,
		EffectName			= "particles/units/heroes/neji/neji_air_palm_proj_linear.vpcf",
		vSpawnOrigin		= caster:GetAttachmentOrigin(caster:ScriptLookupAttachment("attach_attack1")),
		fDistance			= self:GetSpecialValueFor("shard_range"),
		fStartRadius		= radius,
		fEndRadius			= radius,
		Source				= caster,
		bHasFrontalCone		= true,
		bReplaceExisting	= false,
		iUnitTargetTeam		= DOTA_UNIT_TARGET_TEAM_ENEMY,
		iUnitTargetFlags	= DOTA_UNIT_TARGET_FLAG_NONE,
		iUnitTargetType		= DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_BASIC,
		fExpireTime 		= GameRules:GetGameTime() + 10,
		bDeleteOnHit		= false,
		vVelocity			= direction * self:GetSpecialValueFor("shard_speed")
	})
end

---------------------------------------------------------------------------

function neji_air_palm:OnProjectileHit(target, location)
	if not target then return end

	local caster = self:GetCaster()
	local ability = caster:FindAbilityByName("haku_crippling_senbon")
	local damage = self:GetSpecialValueFor("damage")
	local duration = self:GetSpecialValueFor("duration")
	
	if target:IsMagicImmune() == false then
		ApplyDamage({victim = target, attacker = caster, ability = self, damage = damage, damage_type = self:GetAbilityDamageType()})
		target:AddNewModifier(caster, self, "modifier_neji_air_palm_debuff", {duration = duration})
	end
	
	EmitSoundOn("neji_air_palm_impact", target)
end

---------------------------------------------------------------------------

modifier_neji_air_palm_debuff = modifier_neji_air_palm_debuff or class({})

---------------------------------------------------------------------------

function modifier_neji_air_palm_debuff:IsHidden() return false end
function modifier_neji_air_palm_debuff:IsDebuff() return true end

---------------------------------------------------------------------------

function modifier_neji_air_palm_debuff:OnCreated()
	local ability = self:GetAbility()
	self.ms_slow = ability:GetSpecialValueFor("ms_slow")
	self.armor_reduction = -ability:GetSpecialValueFor("armor_reduction")
end

---------------------------------------------------------------------------

function modifier_neji_air_palm_debuff:DeclareFunctions()
	return {
		MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
		MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS
	}
end

---------------------------------------------------------------------------

function modifier_neji_air_palm_debuff:GetModifierMoveSpeedBonus_Percentage()
	return self.ms_slow
end

---------------------------------------------------------------------------

function modifier_neji_air_palm_debuff:GetModifierPhysicalArmorBonus()
	return self.armor_reduction
end

---------------------------------------------------------------------------

function modifier_neji_air_palm_debuff:GetEffectAttachType()
	return PATTACH_ABSORIGIN_FOLLOW
end

---------------------------------------------------------------------------

function modifier_neji_air_palm_debuff:GetEffectName()
	return "particles/econ/events/ti7/shivas_guard_slow.vpcf"
end