naruto_tailed_beast_bomb = naruto_tailed_beast_bomb or class({})

--------------------------------------------------------------------------------

function naruto_tailed_beast_bomb:Precache( context )
	PrecacheResource( "soundfile", "soundevents/heroes/naruto/beastbomb_cast_talking.vsndevts", context )
	PrecacheResource( "soundfile", "soundevents/heroes/naruto/beastbomb_fire_talking.vsndevts", context )
	PrecacheResource( "soundfile", "soundevents/heroes/naruto/beastbomb_cast.vsndevts", context )
	PrecacheResource( "soundfile", "soundevents/heroes/naruto/beastbomb_fire.vsndevts", context )
	PrecacheResource( "soundfile", "soundevents/heroes/naruto/beastbomb_ball.vsndevts", context )
end

--------------------------------------------------------------------------------

function naruto_tailed_beast_bomb:Spawn()
	if not IsServer() then return end
	self:SetLevel(1)
	self:SetHidden(true)
end

--------------------------------------------------------------------------------

function naruto_tailed_beast_bomb:OnAbilityPhaseStart()
	local caster = self:GetCaster()
	caster:EmitSound("beastbomb_cast_talking")
	caster:EmitSound("beastbomb_cast")
	return true
end

--------------------------------------------------------------------------------

function naruto_tailed_beast_bomb:OnSpellStart()
	-- Preventing projectiles getting stuck in one spot due to potential 0 length vector
	if self:GetCursorPosition() == self:GetCaster():GetAbsOrigin() then
		self:GetCaster():SetCursorPosition(self:GetCursorPosition() + self:GetCaster():GetForwardVector())
	end

	self:FireBomb()
end

--------------------------------------------------------------------------------

function naruto_tailed_beast_bomb:FireBomb()
	-- This "dummy" literally only exists to attach the gush travel sound to
	local dummy_unit = CreateModifierThinker(self:GetCaster(), self, nil, {}, self:GetCaster():GetAbsOrigin(), self:GetCaster():GetTeamNumber(), false)
	dummy_unit:EmitSound("beastbomb_ball")
	-- Keep track of how many units the Bomb will hit to calculate damage reductions
	dummy_unit.units_hit = 0
	
	self:GetCaster():StartGesture(ACT_DOTA_OVERRIDE_ABILITY_2)

	self:GetCaster():EmitSound("beastbomb_fire_talking")
	self:GetCaster():EmitSound("beastbomb_fire")

	ProjectileManager:CreateLinearProjectile({
		Source = self:GetCaster(),
		Ability = self,
		vSpawnOrigin = self:GetCaster():GetAbsOrigin(),
		
		iUnitTargetTeam = DOTA_UNIT_TARGET_TEAM_ENEMY,
		iUnitTargetFlags = DOTA_UNIT_TARGET_FLAG_NONE,
		iUnitTargetType = DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_BASIC,

		EffectName = "particles/units/heroes/hero_windrunner/windrunner_spell_powershot.vpcf",
		fDistance = self:GetSpecialValueFor("range") + self:GetCaster():GetCastRangeBonus(),
		fStartRadius = self:GetSpecialValueFor("radius"),
		fEndRadius = self:GetSpecialValueFor("radius"),
		vVelocity = (self:GetCursorPosition() - self:GetCaster():GetAbsOrigin()):Normalized() * self:GetSpecialValueFor("projectile_speed") * Vector(1, 1, 0),

		bProvidesVision = true,
		iVisionRadius = self:GetSpecialValueFor("vision_radius"),
		iVisionTeamNumber = self:GetCaster():GetTeamNumber(),

		ExtraData = {
			dummy_index = dummy_unit:entindex(),
		}
	})

	self:GetCaster():RemoveModifierByName("modifier_kyuubi_chakra_mode")
end

--------------------------------------------------------------------------------

function naruto_tailed_beast_bomb:OnProjectileThink_ExtraData(location, data)
	if data.dummy_index then
		EntIndexToHScript(data.dummy_index):SetAbsOrigin(location)
	end

	GridNav:DestroyTreesAroundPoint(location, 375, true)
end

--------------------------------------------------------------------------------

function naruto_tailed_beast_bomb:OnProjectileHit_ExtraData(target, location, data)
	if target and data.dummy_index and EntIndexToHScript(data.dummy_index) and not EntIndexToHScript(data.dummy_index):IsNull() and EntIndexToHScript(data.dummy_index).units_hit then
		EmitSoundOnLocationWithCaster(location, "Hero_Windrunner.PowershotDamage", self:GetCaster())

		local damage		= (self:GetTalentSpecialValueFor("base_damage") + (self:GetSpecialValueFor("strength_as_damage") * self:GetCaster():GetStrength() / 100)) * ((100 - self:GetSpecialValueFor("damage_reduction_per_hero_hit")) / 100) ^ EntIndexToHScript(data.dummy_index).units_hit
		local damage_type	= self:GetAbilityDamageType()

		if self:GetCaster():HasTalent("special_bonus_naruto_7") then
			damage_type = DAMAGE_TYPE_PURE
		end

		ApplyDamage({
			victim 			= target,
			damage 			= damage,
			damage_type		= damage_type,
			damage_flags 	= DOTA_DAMAGE_FLAG_NONE,
			attacker 		= self:GetCaster(),
			ability 		= self
		})

		EntIndexToHScript(data.dummy_index).units_hit = EntIndexToHScript(data.dummy_index).units_hit + 1
	elseif data.dummy_index then
		EntIndexToHScript(data.dummy_index):StopSound("Ability.Powershot")
		EntIndexToHScript(data.dummy_index):RemoveSelf()
	end
end