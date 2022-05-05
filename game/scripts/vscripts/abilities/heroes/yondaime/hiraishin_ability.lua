yondaime_hiraishin_jump = class({})
LinkLuaModifier("modifier_hiraishin_armor_debuff",
                "abilities/heroes/yondaime/modifiers/modifier_hiraishin_armor_debuff.lua", 
				LUA_MODIFIER_MOTION_NONE )

function yondaime_hiraishin_jump:Precache( context )
    PrecacheResource( "particle",  "particles/units/heroes/hero_juggernaut/juggernaut_omni_slash_tgt.vpcf", context )
    PrecacheResource( "particle",  "particles/units/heroes/hero_juggernaut/juggernaut_omni_slash_trail.vpcf", context )

    PrecacheResource( "soundfile",  "soundevents/game_sounds_heroes/game_sounds_juggernaut.vsndevts", context )
    PrecacheResource( "soundfile",  "soundevents/heroes/yondaime/minato_raijin_impact.vsndevts", context )
    PrecacheResource( "soundfile",  "soundevents/heroes/yondaime/minato_raijin_talking.vsndevts", context )
	PrecacheResource( "soundfile",  "soundevents/heroes/yondaime/minato_raijin_cast.vsndevts", context )
end


function yondaime_hiraishin_jump:GetClosestSeal(target_point)
	--Find the closest seal	
	local placed_seals = self:GetCaster().daggers or {}

	local closest_seal = nil
	local min_dist = self:GetSpecialValueFor("radius") --Maximum allowed distance
	
	local dist = 0

	for k,v in pairs(placed_seals) do
		if not v:IsNull() then
			dist = target_point - v:GetAbsOrigin()
			if(	dist:Length2D() < self:GetSpecialValueFor("radius") )then
				
				if dist:Length2D() < min_dist then
					min_dist = dist:Length2D()
					closest_seal = v
				end
			
			end
		end
	end
	
	return closest_seal
end

function yondaime_hiraishin_jump:CastFilterResultLocation(target_point)
	if IsClient() then
		if self.custom_indicator then
			-- register cursor position
			self.custom_indicator:Register( vLoc )
		end
	end

	local ability = self
	local caster = ability:GetCaster()
	local closest_seal = self:GetClosestSeal(target_point)
	local range = self:GetSpecialValueFor("radius")

	if closest_seal == nil then
		return UF_FAIL_CUSTOM
	end

	if (closest_seal:GetAbsOrigin() - caster:GetAbsOrigin()):Length2D() < self:GetCastRange(target_point ,nil) then
		return UF_SUCCESS
	end
	
	return UF_FAIL_CUSTOM
end

function yondaime_hiraishin_jump:GetCustomCastErrorLocation(target_point)
	return "#error_no_kunai_nearby"
end

function yondaime_hiraishin_jump:OnSpellStart( keys )
	local caster = self:GetCaster()
	local target = self:GetCursorPosition()
	local closest_seal = self:GetClosestSeal(target)
	local direction = (closest_seal:GetAbsOrigin() - caster:GetAbsOrigin()):Normalized()	
	local enemies = FindUnitsInLine(caster:GetTeamNumber(),
		caster:GetAbsOrigin() - direction * 200,
		closest_seal:GetAbsOrigin() + direction * 200,
		nil,
		self:GetSpecialValueFor("search_width"),
		DOTA_UNIT_TARGET_TEAM_ENEMY,
		DOTA_UNIT_TARGET_CREEP + DOTA_UNIT_TARGET_HERO,
		DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES
	)
	
	for _, enemy in pairs(enemies) do
		Timers:CreateTimer(0.05 * (_ - 1), function()
			local trail_effect_index = ParticleManager:CreateParticle("particles/units/heroes/hero_juggernaut/juggernaut_omni_slash_trail.vpcf", PATTACH_CUSTOMORIGIN, caster )
			ParticleManager:SetParticleControl( trail_effect_index, 0, enemy:GetAbsOrigin() )
			ParticleManager:SetParticleControl( trail_effect_index, 1, caster:GetAbsOrigin() )
			Timers:CreateTimer( 0.1, function()
				ParticleManager:DestroyParticle( trail_effect_index, false )
				ParticleManager:ReleaseParticleIndex( trail_effect_index )
				return nil
			end)

			enemy:AddNewModifier(caster, self, "modifier_hiraishin_armor_debuff", {duration = self:GetSpecialValueFor( "armor_duration")})
			ApplyDamage({
				attacker = caster, 
				victim = enemy, 
				damage = caster:GetAverageTrueAttackDamage(nil) * self:GetSpecialValueFor( "damage") / 100, 
				damage_type = self:GetAbilityDamageType(),
				ability = self, 
			})

			ParticleManager:ReleaseParticleIndex(
				ParticleManager:CreateParticle("particles/units/heroes/hero_juggernaut/juggernaut_omni_slash_tgt.vpcf", PATTACH_ABSORIGIN_FOLLOW, enemy)
			)	

			EmitSoundOn("minato_raijin_impact", enemy)
			FindClearSpaceForUnit(caster, enemy:GetAbsOrigin(), false)
		end)
	end

	Timers:CreateTimer(0.05 * #enemies, function()
		local trail_effect_index = ParticleManager:CreateParticle("particles/units/heroes/hero_juggernaut/juggernaut_omni_slash_trail.vpcf", PATTACH_CUSTOMORIGIN, caster)
		ParticleManager:SetParticleControl(trail_effect_index, 0, closest_seal:GetAbsOrigin())
		ParticleManager:SetParticleControl(trail_effect_index, 1, caster:GetAbsOrigin())

		FindClearSpaceForUnit(caster, closest_seal:GetAbsOrigin(), false)

		Timers:CreateTimer(0.1, function()
			ParticleManager:DestroyParticle(trail_effect_index, false)
			ParticleManager:ReleaseParticleIndex(trail_effect_index)
		end)

		caster:EmitSound("minato_raijin_talking")
		caster:EmitSound("minato_raijin_cast")
	end)
end