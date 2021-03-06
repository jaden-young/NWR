-- --[[Author: DigitalG
-- 	Date: April, 4th 2021.
-- ]]

hidan_cull_the_weak = class({})
LinkLuaModifier( "modifier_generic_custom_indicator",
				 "modifiers/modifier_generic_custom_indicator",
				 LUA_MODIFIER_MOTION_BOTH )
LinkLuaModifier( "modifier_hidan_cull_the_weak_ms_slow", 
				 "abilities/heroes/hidan/modifier_hidan_cull_the_weak_ms_slow.lua", 
				 LUA_MODIFIER_MOTION_NONE)

function hidan_cull_the_weak:Precache(context)
	PrecacheResource("soundfile",  "soundevents/game_sounds_heroes/game_sounds_mirana.vsndevts", context)
	PrecacheResource("soundfile",  "soundevents/heroes/hidan/hidan_cull_the_weak_cast.vsndevts", context)
	PrecacheResource("soundfile",  "soundevents/heroes/hidan/hidan_cull_the_weak_fire.vsndevts", context)

	PrecacheResource("particle",   "particles/units/heroes/hidan/hidan_cull_the_weak.vpcf", context)
	PrecacheResource("particle",   "particles/units copy/heroes/hidan/cult_impact.vpcf", context)
end

function hidan_cull_the_weak:GetIntrinsicModifierName()
	return "modifier_generic_custom_indicator"
end

function hidan_cull_the_weak:CreateCustomIndicator()
	local particle_cast = "particles/ui_mouseactions/range_finder_cone.vpcf"
	self.effect_cast = ParticleManager:CreateParticle( particle_cast, PATTACH_ABSORIGIN_FOLLOW, self:GetCaster() )
end

function hidan_cull_the_weak:UpdateCustomIndicator( loc )
	-- get data
	local origin = self:GetCaster():GetAbsOrigin()
	local cast_range = self:GetCastRange(loc, nil)
	local width = self:GetSpecialValueFor("pull_width")

	-- get direction
	local direction = loc - origin
	direction.z = 0
	direction = direction:Normalized()

	ParticleManager:SetParticleControl( self.effect_cast, 0, origin )
	ParticleManager:SetParticleControl( self.effect_cast, 1, origin)
	ParticleManager:SetParticleControl( self.effect_cast, 2, origin + direction*cast_range)
	ParticleManager:SetParticleControl( self.effect_cast, 3, Vector(width, width, 0))
	ParticleManager:SetParticleControl( self.effect_cast, 4, Vector(0, 255, 0)) --Color (green by default)
	ParticleManager:SetParticleControl( self.effect_cast, 6, Vector(1,1,1)) --Enable color change
end

function hidan_cull_the_weak:DestroyCustomIndicator()
	ParticleManager:DestroyParticle( self.effect_cast, false )
	ParticleManager:ReleaseParticleIndex( self.effect_cast )
end

function hidan_cull_the_weak:CastFilterResultLocation(location)
	if IsClient() then
		if self.custom_indicator then
			-- register cursor position
			self.custom_indicator:Register( location )
		end
	end

	return UF_SUCCESS
end

function hidan_cull_the_weak:GetCooldown(level)
	return self.BaseClass.GetCooldown( self, level ) - self:GetCaster():FindTalentValue("special_bonus_hidan_5")
end


function hidan_cull_the_weak:GetCastRange(location, target)
	return self:GetSpecialValueFor("range") + self:GetCaster():FindTalentValue("special_bonus_hidan_4")
end

function hidan_cull_the_weak:OnAbilityPhaseStart()
	self:GetCaster():EmitSound("hidan_cull_the_weak_cast")
	return true
end

function hidan_cull_the_weak:OnSpellStart()
	local caster = self:GetCaster()
	local target_point = self:GetCursorPosition()
	local hero_damage = self:GetSpecialValueFor("hero_damage")
	local creep_damage = self:GetSpecialValueFor("creep_damage")
	local width = self:GetSpecialValueFor("pull_width")
	local heal = caster:GetMaxHealth() *  self:GetSpecialValueFor("heal_per_kill") / 100

	local origin = caster:GetAbsOrigin()
	local direction = caster:GetForwardVector()
	local cast_range = self:GetCastRange(target_point, nil)
	
	local final_target = origin+direction*cast_range

	local damage_table = {
		attacker = caster,
		victim = nil,
		damage = hero_damage,
		damage_type = self:GetAbilityDamageType(),
		ability = self
	}

	caster:EmitSound("hidan_cull_the_weak_fire")

	local enemies = FindUnitsInLine(
		caster:GetTeamNumber(),
		origin, 
		final_target, 
		nil, 
		width, 
		DOTA_UNIT_TARGET_TEAM_ENEMY, 
		DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_BASIC, 
		DOTA_UNIT_TARGET_FLAG_NONE
	)

	for _, enemy in pairs(enemies) do 
		local pull_length = -1 * (( final_target - origin ):Length2D()) + 150
		
		damage_table.victim = enemy
		damage_table.damage = enemy:IsHero() and hero_damage or creep_damage
		ApplyDamage(damage_table)

		if not enemy:IsAlive() then
			caster:HealWithParams(heal, self, false, true, caster, false)
			ParticleManager:ReleaseParticleIndex(
				ParticleManager:CreateParticle("particles/generic_gameplay/generic_lifesteal.vpcf", PATTACH_ABSORIGIN_FOLLOW, caster)
			)
		end

		local knockbackModifierTable =
		{
			should_stun = 0,
			knockback_duration = 0.3,
			duration = 0.3,
			knockback_distance = pull_length,
			knockback_height = 0,
			center_x = origin.x,
			center_y = origin.y,
			center_z = origin.z
		}

		enemy:AddNewModifier( caster, nil, "modifier_knockback", knockbackModifierTable )

		local impact_vfx = ParticleManager:CreateParticle("particles/units/heroes/hidan/cult_impact.vpcf", PATTACH_ABSORIGIN, enemy)
		ParticleManager:SetParticleControlEnt(impact_vfx, 0, enemy, PATTACH_POINT_FOLLOW, "attach_hitloc", Vector(0, 0, 0), true)
		ParticleManager:ReleaseParticleIndex(impact_vfx)
	end

	--Particles
	local cull_vfx = ParticleManager:CreateParticle("particles/units/heroes/hidan/hidan_cull_the_weak.vpcf", PATTACH_ABSORIGIN, caster)
	local diff = (final_target - caster:GetAbsOrigin()):Normalized()
	ParticleManager:SetParticleControl(cull_vfx, 0, final_target)
	ParticleManager:SetParticleControl(cull_vfx, 1, caster:GetAbsOrigin())
	ParticleManager:SetParticleControl(cull_vfx, 2, caster:GetAbsOrigin())
	ParticleManager:SetParticleControl(cull_vfx, 4, Vector(-direction.y, direction.x, direction.z)*width/2) --rotating direction vector to get offset
	ParticleManager:SetParticleControl(cull_vfx, 5, Vector(direction.y, -direction.x, direction.z)*width/2)
	ParticleManager:SetParticleControl(cull_vfx, 7, Vector(diff.x*3000, diff.y*3000, diff.z))
	ParticleManager:ReleaseParticleIndex(cull_vfx)
end




