LinkLuaModifier("modifier_naruto_rasenshuriken_slow", 	"abilities/heroes/naruto/rasenshuriken", LUA_MODIFIER_MOTION_NONE)
--------------------------------------------------------------------------------

naruto_rasenshuriken = naruto_rasenshuriken or class({})

--------------------------------------------------------------------------------

function naruto_rasenshuriken:Precache(context)
    PrecacheResource("particle", "particles/units/heroes/naruto/naruto_atomic_dismantling.vpcf", context)
    PrecacheResource("soundfile", "soundevents/heroes/naruto/game_sounds_naruto.vsndevts", context)
end

--------------------------------------------------------------------------------

function naruto_rasenshuriken:Spawn()
	if not IsServer() then return end
	self:SetLevel(1)
	self:SetHidden(true)
end


function naruto_rasenshuriken:OnAbilityPhaseStart()
	EmitSoundOn("Hero_Naruto.RasenShuriken.Precast", self:GetCaster())

	self.shuriken_fx = ParticleManager:CreateParticle("particles/units/heroes/naruto/rasenshuriken_precast.vpcf", PATTACH_ABSORIGIN_FOLLOW, self:GetCaster())
	ParticleManager:SetParticleControlEnt(self.shuriken_fx, 0, self:GetCaster(), PATTACH_POINT_FOLLOW, "attach_attack1", self:GetCaster():GetAbsOrigin(), true)
	--ParticleManager:SetParticleControlEnt(self.shuriken_fx, 1, self:GetCaster(), PATTACH_POINT_FOLLOW, "attach_attack1", self:GetCaster():GetAbsOrigin(), true)
	--ParticleManager:SetParticleControlEnt(self.shuriken_fx, 2, self:GetCaster(), PATTACH_POINT_FOLLOW, "attach_attack1", self:GetCaster():GetAbsOrigin(), true)
	ParticleManager:SetParticleControlEnt(self.shuriken_fx, 3, self:GetCaster(), PATTACH_POINT_FOLLOW, "attach_attack1", self:GetCaster():GetAbsOrigin(), true)
	
	return true
end

function naruto_rasenshuriken:OnAbilityPhaseInterrupted()
	StopSoundOn("Hero_Naruto.RasenShuriken.Precast", self:GetCaster())
	ParticleManager:DestroyParticle(self.shuriken_fx, true)
	ParticleManager:ReleaseParticleIndex(self.shuriken_fx)
end

--------------------------------------------------------------------------------

function naruto_rasenshuriken:OnSpellStart()
	ParticleManager:DestroyParticle(self.shuriken_fx, true)
	ParticleManager:ReleaseParticleIndex(self.shuriken_fx)

	local caster = self:GetCaster()
	local target = self:GetCursorTarget()

	ProjectileManager:CreateTrackingProjectile({
		iSourceAttachment = DOTA_PROJECTILE_ATTACHMENT_ATTACK_1,
		EffectName = "particles/units/heroes/naruto/rasenshuriken_alt.vpcf",
		Ability = self,
		Source = caster,
		bProvidesVision = false,
		Target = target,
		iMoveSpeed = 1000,
		bDodgeable = false,
		iProjec
	})

	EmitSoundOn("Hero_Naruto.RasenShuriken.Cast", caster)
end

--------------------------------------------------------------------------------

function naruto_rasenshuriken:OnProjectileHit(target, location)
	if not target then return end

	local caster = self:GetCaster()
	local base_damage = self:GetSpecialValueFor("base_damage")
	local multiplier = self:GetSpecialValueFor("attack_dmg_mult")
	local total_damage = caster:GetAverageTrueAttackDamage(nil) * multiplier + base_damage

	local damage_table = {
		attacker = caster,
		victim = nil,
		damage = total_damage,
		damage_type = self:GetAbilityDamageType(),
		ability = self
	}

	location = target:GetAbsOrigin()
	


	EmitSoundOn("Hero_Naruto.RasenShuriken.Impact", target)
	local impact_fx = ParticleManager:CreateParticle("particles/units/heroes/naruto/shuriken_impact.vpcf", PATTACH_ABSORIGIN, target)
	ParticleManager:SetParticleControl(impact_fx, 1, location)
	ParticleManager:SetParticleControl(impact_fx, 2, location)
	ParticleManager:SetParticleControl(impact_fx, 3, location)
	ParticleManager:ReleaseParticleIndex(impact_fx)

	local enemies = FindUnitsInRadius(
		caster:GetTeamNumber(), 
		target:GetAbsOrigin(), 
		nil, 
		self:GetSpecialValueFor("radius"), 
		self:GetAbilityTargetTeam(), 
		self:GetAbilityTargetType(), 
		self:GetAbilityTargetFlags(), 
		0, 
		false
	)

	for _, enemy in pairs(enemies) do
		damage_table.victim = enemy
		ApplyDamage(damage_table)

		enemy:AddNewModifier(caster, self, "modifier_stunned", {duration = self:GetSpecialValueFor("stun_duration") * (1 - enemy:GetStatusResistance())})
	end
end