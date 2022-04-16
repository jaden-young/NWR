LinkLuaModifier("modifier_clone_charges", 	"abilities/heroes/naruto/shadow_clone_technique", LUA_MODIFIER_MOTION_NONE)
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
	return "modifier_clone_charges"
end

--------------------------------------------------------------------------------

function naruto_shadow_clone_technique:Spawn()
	if not IsServer() or not self or self:IsNull() or not self:GetCaster():IsRealHero() then return end
	ListenToGameEvent("dota_player_learned_ability", function(event) return self:OnAbilityLearned(event) end, nil)
end

--------------------------------------------------------------------------------

function naruto_shadow_clone_technique:OnAbilityLearned(event)
	if event.PlayerID ~= self:GetCaster():GetPlayerOwnerID() or event.abilityname ~= "special_bonus_naruto_5" then return end

	self:GetCaster():FindModifierByName(self:GetIntrinsicModifierName()):OnRefresh()
end

--------------------------------------------------------------------------------

function naruto_shadow_clone_technique:GetBehavior()
	if self:GetCaster():HasShard() then
		return DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR_IMMEDIATE
	end

	return self.BaseClass.GetBehavior(self)
end

--------------------------------------------------------------------------------

function naruto_shadow_clone_technique:GetCastAnimation()
	if not self.last_cast or self.last_cast + self:GetSpecialValueFor("precast_anims_vo_cd") < GameRules:GetDOTATime(true, true) then
		return ACT_DOTA_CAST_ABILITY_1
	else
		return ACT_DOTA_INVALID
	end
end

function naruto_shadow_clone_technique:OnAbilityPhaseStart()
	if not self.last_cast or self.last_cast + self:GetSpecialValueFor("precast_anims_vo_cd") < GameRules:GetDOTATime(true, true) then
		EmitSoundOn("shadow_clone_cast", self:GetCaster())
	end

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

		local spawn_fx = ParticleManager:CreateParticle("particles/units/heroes/naruto/naruto_clone_dust.vpcf", PATTACH_ABSORIGIN_FOLLOW, clone)
		ParticleManager:SetParticleControlEnt(spawn_fx, 0, clone, PATTACH_POINT_FOLLOW, "attach_hitloc", Vector(0, 0, 0), true)
		ParticleManager:ReleaseParticleIndex(spawn_fx)

		clones_created = clones_created + 1 

		return clones_created < count and delay or nil
	end)

	if not self.last_cast or self.last_cast + self:GetSpecialValueFor("shadow_clone_fire_cd") < GameRules:GetDOTATime(true, true) then
		EmitSoundOn("shadow_clone_fire", caster)
	end

	if not self.last_cast or self.last_cast + self:GetSpecialValueFor("talking_cd") < GameRules:GetDOTATime(true, true) then
		EmitSoundOn("shadow_clone_talking", caster)
	end

	self.last_cast = GameRules:GetDOTATime(true, true)
end

--------------------------------------------------------------------------------

function naruto_shadow_clone_technique:CheckChakraMode(clone)
	local caster = self:GetCaster()
	local active = caster:HasModifier("modifier_kyuubi_chakra_mode_active")
	local ability = caster:FindAbilityByName("naruto_kyuubi_chakra_mode")

	if active and ability then
		ability:ActivateChakraMode(clone, false)
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

--------------------------------------------------------------------------------

modifier_clone_charges = class({})

--------------------------------------------------------------------------------

function modifier_clone_charges:IsHidden()        return not self.active end
function modifier_clone_charges:IsPurgable()      return false end
function modifier_clone_charges:DestroyOnExpire() return false end
function modifier_clone_charges:GetAttributes()   return MODIFIER_ATTRIBUTE_MULTIPLE end

--------------------------------------------------------------------------------

function modifier_clone_charges:OnCreated( kv )
	local ability = self:GetAbility()
	self.max_charges = ability:GetSpecialValueFor("max_charges") + self:GetParent():FindTalentValue("special_bonus_naruto_5")
	self.charge_time = ability:GetSpecialValueFor("charge_restore_time")
	self.active = true

	if not IsServer() then return end
	self:SetStackCount(self.max_charges)
	self:CalculateCharge()
end

--------------------------------------------------------------------------------

function modifier_clone_charges:OnRefresh( kv )
	local ability = self:GetAbility()
	self.max_charges = ability:GetSpecialValueFor("max_charges") + self:GetParent():FindTalentValue("special_bonus_naruto_5")
	self.charge_time = ability:GetSpecialValueFor("charge_restore_time")

	if not IsServer() then return end
	self:CalculateCharge(true)
end

--------------------------------------------------------------------------------

function modifier_clone_charges:DeclareFunctions()
	return {MODIFIER_EVENT_ON_ABILITY_FULLY_CAST}
end

--------------------------------------------------------------------------------

function modifier_clone_charges:OnAbilityFullyCast( params )
	if IsServer() then
		if params.unit~=self:GetParent() or params.ability~=self:GetAbility() then
			return
		end

		self:DecrementStackCount()
		self:CalculateCharge()
	end
end
--------------------------------------------------------------------------------

function modifier_clone_charges:OnIntervalThink()
	self:IncrementStackCount()
	self:StartIntervalThink(-1)
	self:CalculateCharge()
end

--------------------------------------------------------------------------------

function modifier_clone_charges:CalculateCharge(refresh)
	local ability = self:GetAbility()

	if self.active and self:GetStackCount() > 0 then
		ability:EndCooldown()
	end

	if self:GetStackCount()>=self.max_charges and not refresh then
		self:SetDuration( -1, true )
		self:StartIntervalThink( -1 )
	else
		if self:GetRemainingTime() <= 0.05 then
			local charge_time = ability:GetCooldown( -1 )
			if self.charge_time and self.active then
				charge_time = self.charge_time
			end
			self:StartIntervalThink( charge_time )
			self:SetDuration( charge_time, true )
		end

		if self:GetStackCount()==0 and not refresh then
			ability:StartCooldown( self:GetRemainingTime() )
		end
	end
end

--------------------------------------------------------------------------------
-- Helper
function modifier_clone_charges:SetActive(active)
	self.active = active
end