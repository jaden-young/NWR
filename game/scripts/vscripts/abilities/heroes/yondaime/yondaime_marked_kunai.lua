LinkLuaModifier( "modifier_marked_kunai_debuff", 	"abilities/heroes/yondaime/yondaime_marked_kunai.lua" , LUA_MODIFIER_MOTION_NONE )
LinkLuaModifier( "modifier_marked_kunai_bonus", 	"abilities/heroes/yondaime/yondaime_marked_kunai.lua" , LUA_MODIFIER_MOTION_NONE )
LinkLuaModifier( "modifier_kunai_charges", 			"abilities/heroes/yondaime/yondaime_marked_kunai.lua" , LUA_MODIFIER_MOTION_NONE )
-----------------------------------------------------------------------------------------------------------------------------------

yondaime_marked_kunai = yondaime_marked_kunai or class({})

---------------------------------------------------------------------------------------

function yondaime_marked_kunai:Precache( context )
    PrecacheResource( "particle",  "particles/units/heroes/yondaime/kunai_proc.vpcf", context )
    PrecacheResource( "particle",  "particles/units/heroes/hero_phantom_assassin/phantom_assassin_stifling_dagger_debuff.vpcf", context )
    PrecacheResource( "particle",  "particles/units/heroes/hero_bounty_hunter/bounty_hunter_track_haste.vpcf", context )
    PrecacheResource( "particle",  "particles/units/heroes/yondaime/blink_core.vpcf", context )
    PrecacheResource( "particle",  "particles/units/heroes/yondaime/kunai_ground.vpcf", context )
    PrecacheResource( "soundfile", "soundevents/game_sounds_heroes/game_sounds_phantom_assassin.vsndevts", context )
end

---------------------------------------------------------------------------------------

function yondaime_marked_kunai:GetIntrinsicModifierName()
	return "modifier_kunai_charges"
end

---------------------------------------------------------------------------------------

function yondaime_marked_kunai:OnInventoryContentsChanged()
	if self:GetCaster():HasShard() and not self.shard_enabled then
		self.shard_enabled = true
		self:EndCooldown()
	end
end

---------------------------------------------------------------------------------------

function yondaime_marked_kunai:GetCooldown(iLevel)
	local caster = self:GetCaster()

	if caster:HasShard() then
		return self.BaseClass.GetCooldown(self, iLevel) + caster:FindTalentValue("special_bonus_yondaime_1") - self:GetSpecialValueFor("shard_cd_reduction")
	else
		return self.BaseClass.GetCooldown(self, iLevel) + caster:FindTalentValue("special_bonus_yondaime_1")
	end
end

---------------------------------------------------------------------------------------

function yondaime_marked_kunai:GetCastRange(location, target)
	return self.BaseClass.GetCastRange(self, location, target) + self:GetCaster():FindTalentValue("special_bonus_yondaime_2")
end

---------------------------------------------------------------------------------------

function yondaime_marked_kunai:OnSpellStart()
	local caster = self:GetCaster()
	local ability = self
	local casterOrigin = caster:GetAbsOrigin()
	local targetPos = self:GetCursorPosition()
	local direction = targetPos - casterOrigin
	local dagger_radius = ability:GetSpecialValueFor("dagger_radius")
	local distance = math.sqrt(direction.x * direction.x + direction.y * direction.y)
	local speed = ability:GetSpecialValueFor("dagger_speed")

	if caster.daggers == nil then
		caster.daggers = {}
	end

	caster:EmitSound("Hero_PhantomAssassin.Dagger.Cast")

	self.ability = self
	self.caster = caster
	self.creep_damage = self.ability:GetSpecialValueFor("creep_damage")
	self.hero_damage = self.ability:GetSpecialValueFor("hero_damage")

	caster.isDC = true
	direction = direction / direction:Length2D()

	ProjectileManager:CreateLinearProjectile( {
		Ability				= ability,
		EffectName			= "particles/units/heroes/yondaime/kunai_alt.vpcf",
		vSpawnOrigin		= casterOrigin,
		fDistance			= distance,
		fStartRadius		= dagger_radius,
		fEndRadius			= dagger_radius,
		Source				= caster,
		bHasFrontalCone		= false,
		bReplaceExisting	= false,
		iUnitTargetTeam		= DOTA_UNIT_TARGET_TEAM_ENEMY,
		iUnitTargetFlags	= DOTA_UNIT_TARGET_FLAG_NONE,
		iUnitTargetType		= DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_CREEP,
	--	fExpireTime			= ,
		bDeleteOnHit 		= false,
		vVelocity			= direction * speed,
		bProvidesVision		= false,
		iVisionRadius		= 300,
		iVisionTeamNumber	= caster:GetTeamNumber(),
	} )
end

---------------------------------------------------------------------------------------

function yondaime_marked_kunai:OnUpgrade()
	local flicker = self:GetCaster():FindAbilityByName("yondaime_body_flicker")
	flicker:SetLevel( self:GetCaster():FindAbilityByName("yondaime_marked_kunai"):GetLevel())
end

---------------------------------------------------------------------------------------

function yondaime_marked_kunai:OnProjectileHit(hTarget, vLocation)
	if hTarget == nil then 

		-- Variables
		local caster = self.caster
		local ability = self.ability
		local target_point = vLocation

		self.buff_duration = self.ability:GetSpecialValueFor("duration")
	
		-- Special Variables
		local duration = ability:GetSpecialValueFor("dagger_duration")
	
		-- Dummy
		local dummy = CreateUnitByName("npc_marked_kunai", target_point, false, caster, caster, caster:GetTeam())
		dummy:SetOriginalModel("models/yondaime_new/yondakunai.vmdl")
		dummy:AddNewModifier(caster, nil, "modifier_phased", {})
		dummy:SetModelScale(4.0)
		dummy:AddNewModifier(caster, ability, "modifier_marked_kunai_bonus", {duration = duration})
	
		-- dummy:SetUnitName("npc_marked_kunai")
	
		table.insert(self.caster.daggers, dummy)
		ability.kunai = dummy
	
		local particle = ParticleManager:CreateParticle("particles/units/heroes/yondaime/kunai_ground.vpcf", PATTACH_POINT_FOLLOW, dummy) 
		ParticleManager:SetParticleControlEnt(particle, 0, dummy, PATTACH_POINT_FOLLOW, "attach_origin", dummy:GetAbsOrigin(), true)
		ParticleManager:SetParticleControlEnt(particle, 1, dummy, PATTACH_POINT_FOLLOW, "attach_origin", dummy:GetAbsOrigin(), true)
		ParticleManager:SetParticleControlEnt(particle, 3, dummy, PATTACH_POINT_FOLLOW, "attach_origin", dummy:GetAbsOrigin(), true)
	
		local kunai_duration = ability:GetLevelSpecialValueFor("dagger_duration", (ability:GetLevel() - 1))
	
		Timers:CreateTimer( kunai_duration, function()
					dummy:RemoveSelf()
					return nil
		end
		)
		return
	end

	if hTarget:IsBuilding() then
		return
	end

	hTarget:EmitSound("Hero_PhantomAssassin.Dagger.Target")

	if hTarget:IsRealHero() then
		ApplyDamage({ victim =hTarget, attacker = self.caster, damage = self.hero_damage, damage_type = DAMAGE_TYPE_MAGICAL })
	else
		ApplyDamage({ victim =hTarget, attacker = self.caster, damage = self.creep_damage, damage_type = DAMAGE_TYPE_MAGICAL })
	end
end

---------------------------------------------------------------------------------------

modifier_marked_kunai_bonus = class({})

---------------------------------------------------------------------------------------

function modifier_marked_kunai_bonus:CheckState()
	return {
		[MODIFIER_STATE_NO_HEALTH_BAR] = true,
		[MODIFIER_STATE_INVULNERABLE] = true,
		[MODIFIER_STATE_NOT_ON_MINIMAP] = true,
		[MODIFIER_STATE_UNSELECTABLE] = true,
	}
end

---------------------------------------------------------------------------------------

function modifier_marked_kunai_bonus:GetModifierProvidesFOWVision()
	return 1
end

--------------------------------------------------------------------------------

modifier_kunai_charges = class({})

--------------------------------------------------------------------------------

function modifier_kunai_charges:IsHidden()        return not self:GetCaster():HasShard() end
function modifier_kunai_charges:IsPurgable()      return false end
function modifier_kunai_charges:DestroyOnExpire() return false end
function modifier_kunai_charges:GetAttributes()   return MODIFIER_ATTRIBUTE_MULTIPLE end

--------------------------------------------------------------------------------

function modifier_kunai_charges:OnCreated( kv )
	local ability = self:GetAbility()
	self.max_charges = ability:GetSpecialValueFor("shard_charges")
	self.charge_time = ability:GetCooldown(ability:GetLevel())

	if not IsServer() then return end
	self:SetStackCount(self.max_charges)
	self:CalculateCharge()
end

--------------------------------------------------------------------------------

function modifier_kunai_charges:OnRefresh( kv )
	local ability = self:GetAbility()
	self.max_charges = ability:GetSpecialValueFor("shard_charges")
	self.charge_time = ability:GetCooldown(ability:GetLevel())

	if not IsServer() then return end
	self:CalculateCharge(true)
end

--------------------------------------------------------------------------------

function modifier_kunai_charges:DeclareFunctions()
	return {MODIFIER_EVENT_ON_ABILITY_FULLY_CAST}
end

--------------------------------------------------------------------------------

function modifier_kunai_charges:OnAbilityFullyCast( params )
	if IsServer() then
		if params.unit~=self:GetParent() or params.ability~=self:GetAbility() then
			return
		end

		self:DecrementStackCount()
		self:CalculateCharge()
	end
end
--------------------------------------------------------------------------------

function modifier_kunai_charges:OnIntervalThink()
	self:IncrementStackCount()
	self:StartIntervalThink(-1)
	self:CalculateCharge()
end

--------------------------------------------------------------------------------

function modifier_kunai_charges:CalculateCharge(refresh)
	local ability = self:GetAbility()

	if self:GetCaster():HasShard() and self:GetStackCount() > 0 then
		ability:EndCooldown()
	end

	if self:GetStackCount()>=self.max_charges and not refresh then
		self:SetDuration( -1, true )
		self:StartIntervalThink( -1 )
	else
		if self:GetRemainingTime() <= 0.05 then
			local charge_time = ability:GetCooldown( -1 )
			if self.charge_time and self:GetCaster():HasShard() then
				charge_time = self.charge_time
			end
			self:StartIntervalThink( charge_time )
			self:SetDuration( charge_time, true )
		end

		if self:GetStackCount() == 0 and not refresh then
			ability:StartCooldown( self:GetRemainingTime() )
		end
	end
end