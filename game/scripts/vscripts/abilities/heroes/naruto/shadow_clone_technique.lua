LinkLuaModifier("modifier_generic_charges", 	"modifiers/modifier_generic_charges", LUA_MODIFIER_MOTION_NONE)
--------------------------------------------------------------------------------

naruto_shadow_clone_technique = naruto_shadow_clone_technique or class({})

--------------------------------------------------------------------------------

function naruto_shadow_clone_technique:Precache( context )
	PrecacheResource( "soundfile", "soundevents/heroes/naruto/shadow_clone_cast.vsndevts", context )
	PrecacheResource( "soundfile", "soundevents/heroes/naruto/shadow_clone_fire.vsndevts", context )
	PrecacheResource( "soundfile", "soundevents/heroes/naruto/shadow_clone_talking.vsndevts", context )
	PrecacheResource( "particle",  "particles/units/heroes/naruto/naruto_clone.vpcf", context )
end

--------------------------------------------------------------------------------

function naruto_shadow_clone_technique:GetIntrinsicModifierName()
	return "modifier_generic_charges"
end

--------------------------------------------------------------------------------

function naruto_shadow_clone_technique:CastFilterResult()
	if self:GetCaster():HasModifier("modifier_naruto_rasengan") and not self:GetCaster():HasShard() then 
		return UF_FAIL_CUSTOM 
	end

	return UF_SUCCESS
end

--------------------------------------------------------------------------------

function naruto_shadow_clone_technique:GetCustomCastError()
	return "#dota_hud_error_active_rasengan"
end

--------------------------------------------------------------------------------

function naruto_shadow_clone_technique:GetCooldown(iLevel)
	return self.BaseClass.GetCooldown(self, iLevel) - self:GetCaster():FindTalentValue("special_bonus_naruto_5")
end

--------------------------------------------------------------------------------

function naruto_shadow_clone_technique:GetBehavior()
	if self:GetCaster():HasShard() then
		return DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR_IMMEDIATE
	end

	return self.BaseClass.GetBehavior(self)
end

--------------------------------------------------------------------------------

function naruto_shadow_clone_technique:OnAbilityPhaseStart()
	EmitSoundOn("shadow_clone_cast", self:GetCaster())
	
	return true
end

--------------------------------------------------------------------------------

function naruto_shadow_clone_technique:OnSpellStart()
	local caster = self:GetCaster()
	local charge_modifier = caster:FindModifierByName(self:GetIntrinsicModifierName())
	local outgoing_damage = self:GetSpecialValueFor("outgoing_damage")
	local incoming_damage = self:GetSpecialValueFor("incoming_damage")
	local duration = self:GetSpecialValueFor("illusion_duration")
	local count = self:GetSpecialValueFor("clones_per_charge")
	local delay = self:GetSpecialValueFor("delay_between_illusions")
	local clones_created = 0

	local kv = {
		outgoing_damage = outgoing_damage - 100,
		incoming_damage = incoming_damage - 100,
		bounty_base = 0,
        bounty_growth = 0,
        outgoing_damage_structure = outgoing_damage - 100,
        outgoing_damage_roshan = outgoing_damage - 100,
        duration = duration
	}


	Timers:CreateTimer(delay * clones_created, function()
		local clone = CreateIllusions(caster, caster, kv, 1, 0, false, true)[1]
		local pos = caster:GetAbsOrigin() + RandomVector(RandomInt(100, self:GetSpecialValueFor("spawn_radius")))
		
		FindClearSpaceForUnit(clone, pos, true)
		self:CheckChakraMode(clone)
		self:CheckRasengans(clone)
		self:SendAttackOrder(clone)

		ParticleManager:ReleaseParticleIndex(ParticleManager:CreateParticle("particles/units/heroes/naruto/naruto_clone.vpcf", PATTACH_ABSORIGIN, illusion))
		ParticleManager:ReleaseParticleIndex(ParticleManager:CreateParticle("particles/units/heroes/hero_siren/naga_siren_mirror_image.vpcf", PATTACH_ABSORIGIN, illusion))
		ParticleManager:ReleaseParticleIndex(ParticleManager:CreateParticle("particles/units/heroes/hero_siren/naga_siren_riptide_foam.vpcf", PATTACH_ABSORIGIN, illusion))
		

		clones_created = clones_created + 1 

		return clones_created < count and delay or nil
	end)


	EmitSoundOn("shadow_clone_fire", caster)
	EmitSoundOn("shadow_clone_talking", caster)
end

--------------------------------------------------------------------------------

function naruto_shadow_clone_technique:CheckChakraMode(clone)
	local caster = self:GetCaster()
	local active = caster:HasModifier("modifier_kyuubi_chakra_mode_active")
	local ability = caster:FindAbilityByName("naruto_kyuubi_chakra_mode")

	if active and ability then
		ability:ActivateChakraMode(clone)
	end
end

--------------------------------------------------------------------------------

function naruto_shadow_clone_technique:CheckRasengans(clone)
	local caster = self:GetCaster()
	local active = caster:HasModifier("modifier_naruto_rasengan")
	local ability = caster:FindAbilityByName("naruto_rasengan")

	if caster:HasShard() and active and ability then
		ability:ActivateRasengan(clone)
	end
end

--------------------------------------------------------------------------------

function naruto_shadow_clone_technique:SendAttackOrder(clone)
	local caster = self:GetCaster()
	local enemies = FindUnitsInRadius(
		caster:GetTeamNumber(), 
		caster:GetAbsOrigin(), 
		nil, 
		self:GetSpecialValueFor("attack_search_radius"), 
		DOTA_UNIT_TARGET_TEAM_ENEMY, 
		DOTA_UNIT_TARGET_HERO, 
		DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, 
		FIND_CLOSEST, 
		false
	)

	if #enemies == 0 then
		enemies = FindUnitsInRadius(
			caster:GetTeamNumber(), 
			caster:GetAbsOrigin(), 
			nil, 
			self:GetSpecialValueFor("attack_search_radius"), 
			DOTA_UNIT_TARGET_TEAM_ENEMY, 
			DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_BASIC, 
			DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, 
			FIND_CLOSEST, 
			false
		)
	end

	if #enemies == 0 then return end

	Timers:CreateTimer(FrameTime(), function()
		ExecuteOrderFromTable({
			OrderType = DOTA_UNIT_ORDER_ATTACK_TARGET,
			UnitIndex = clone:entindex(),
			TargetIndex = enemies[1]:entindex(),
			Queue = false
		})
	end)
end