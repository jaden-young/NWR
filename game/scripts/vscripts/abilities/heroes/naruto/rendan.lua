LinkLuaModifier("modifier_naruto_rendan", "abilities/heroes/naruto/rendan", LUA_MODIFIER_MOTION_NONE)
LinkLuaModifier("modifier_naruto_rendan_boost", "abilities/heroes/naruto/rendan", LUA_MODIFIER_MOTION_NONE)
--------------------------------------------------------------------------------

naruto_rendan = naruto_rendan or class({})

--------------------------------------------------------------------------------

function naruto_rendan:Precache( context )
	PrecacheResource( "soundfile", "soundevents/heroes/naruto/rendan_talking.vsndevts", context )
	PrecacheResource( "soundfile", "soundevents/heroes/naruto/rendan_fire.vsndevts", context )
end

--------------------------------------------------------------------------------

function naruto_rendan:GetIntrinsicModifierName()
	return "modifier_naruto_rendan"
end

--------------------------------------------------------------------------------

function naruto_rendan:OnSpellStart()
	self:GetCaster():EmitSound("rendan_talking")
	self:GetCaster():EmitSound("rendan_fire")
	for k, v in pairs(Entities:FindAllByClassname("npc_dota_hero_dragon_knight")) do
		if v:GetTeam() == self:GetCaster():GetTeam() then
			local distance = (v:GetAbsOrigin() - self:GetCaster():GetAbsOrigin()):Length2D()

			if distance <= self:GetSpecialValueFor("clone_gather_range") then
				v:MoveToTargetToAttack(self:GetCursorTarget())

				local rush_modifier = v:AddNewModifier(self:GetCaster(), self, "modifier_naruto_rendan_boost", {duration = 5})

				if rush_modifier then
					rush_modifier:SetStackCount(-self:GetCursorTarget():entindex())
				end
			end
		end
	end
end

--------------------------------------------------------------------------------

modifier_naruto_rendan = modifier_naruto_rendan or class({})

--------------------------------------------------------------------------------

function modifier_naruto_rendan:IsHidden() 		return false end
function modifier_naruto_rendan:IsPurgable() 	return false end

--------------------------------------------------------------------------------

function modifier_naruto_rendan:DeclareFunctions() 
	return {
		MODIFIER_EVENT_ON_ORDER,
		MODIFIER_EVENT_ON_ATTACK_RECORD,
	} 
end

--------------------------------------------------------------------------------

function modifier_naruto_rendan:OnCreated()
	if not IsServer() then return end

	if not self:GetParent():IsIllusion() then
		self:Destroy()
		return
	end

	self:StartIntervalThink(0.1)
end

--------------------------------------------------------------------------------

function modifier_naruto_rendan:OnIntervalThink()
	if self.bRushChecking and self:GetParent():GetAggroTarget() == self.target and (self.target:GetAbsOrigin() - self:GetParent():GetAbsOrigin()):Length2D() <= self:GetAbility():GetSpecialValueFor("max_distance") then
		self:GetParent():EmitSound("rendan_fire")

		local rush_modifier = self:GetParent():AddNewModifier(self:GetCaster(), self:GetAbility(), "modifier_naruto_rendan_boost", {duration = 5})

		if rush_modifier then
			rush_modifier:SetStackCount(-self.target:entindex())
		end

		self:GetAbility():UseResources(true, false, true)

		self.bRushChecking = false
	end
end

--------------------------------------------------------------------------------

function modifier_naruto_rendan:OnOrder(keys)
	if not IsServer() then return end
	local ability = self:GetAbility()
	local parent = self:GetParent()
	local caster = self:GetCaster()
	local caster_ability

	for k, v in pairs(Entities:FindAllByClassname("npc_dota_hero_dragon_knight")) do
		if v:GetTeam() == parent:GetTeam() and not v:IsIllusion() then
			caster_ability = v:FindAbilityByName(ability:GetAbilityName())
		end
	end

	if keys.unit == parent and ability and caster_ability and ability:IsCooldownReady() and not parent:PassivesDisabled() and keys.target then
		if keys.order_type == DOTA_UNIT_ORDER_ATTACK_TARGET then
			if (keys.target:GetAbsOrigin() - parent:GetAbsOrigin()):Length2D() <= GetAbilityKV(ability:GetAbilityName(), "AbilityCastRange", ability:GetLevel()) and (keys.target:GetAbsOrigin() - parent:GetAbsOrigin()):Length2D() >= ability:GetSpecialValueFor("min_distance") then
				parent:EmitSound("rendan_fire")

				local rush_modifier

				if ability:IsCooldownReady() then
					rush_modifier = parent:AddNewModifier(caster, ability, "modifier_naruto_rendan_boost", {duration = 5})
					ability:UseResources(true, false, true)
				else
					rush_modifier = parent:AddNewModifier(caster, ability, "modifier_naruto_rendan_boost", {duration = 5})
				end
				
				if rush_modifier then
					rush_modifier:SetStackCount(-keys.target:entindex())
				end
			else
				self.target = keys.target
				self.bRushChecking  = true
			end
		else
			self.target = nil
			self.bRushChecking = false
		end
	end
end

--------------------------------------------------------------------------------

function modifier_naruto_rendan:OnAttackRecord(keys)
	if keys.attacker == self:GetParent() and self:GetAbility() and self:GetAbility():IsCooldownReady() and self:GetParent():HasScepter() and not keys.no_attack_cooldown and not self:GetParent():PassivesDisabled() then
		if not self:GetParent():HasModifier("modifier_naruto_rendan_boost") then
			self:GetParent():EmitSound("rendan_fire")
		
			local rush_modifier = self:GetParent():AddNewModifier(self:GetCaster(), self:GetAbility(), "modifier_naruto_rendan_boost", {duration = 5})
		
			if rush_modifier then
				rush_modifier:SetStackCount(-keys.target:entindex())
			end
		
			self:GetAbility():UseResources(true, false, true)
		end
	end
end

--------------------------------------------------------------------------------

modifier_naruto_rendan_boost = modifier_naruto_rendan_boost or class({})

--------------------------------------------------------------------------------

function modifier_naruto_rendan_boost:GetEffectName()
	return "particles/units/heroes/hero_phantom_lancer/phantomlancer_edge_boost.vpcf"
end

--------------------------------------------------------------------------------

function modifier_naruto_rendan_boost:CheckState() return {
	[MODIFIER_STATE_NO_UNIT_COLLISION] = true
} end

--------------------------------------------------------------------------------

function modifier_naruto_rendan_boost:DeclareFunctions() 
	return {
		MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE_MIN,
		MODIFIER_EVENT_ON_ORDER,
		MODIFIER_EVENT_ON_STATE_CHANGED,
		MODIFIER_EVENT_ON_ATTACK_START,
		MODIFIER_EVENT_ON_ATTACK_LANDED,
		MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
	}
end

--------------------------------------------------------------------------------

function modifier_naruto_rendan_boost:OnCreated(keys)
	local ability = self:GetAbility()
	self.bonus_speed = ability:GetSpecialValueFor("charge_speed") + self:GetCaster():FindTalentValue("special_bonus_naruto_1")
	self.bonus_damage = ability:GetSpecialValueFor("damage")

	self:StartIntervalThink(FrameTime())	

	if not IsServer() then return end

	if self:GetParent():IsIllusion() then
		self.bonus_damage = ability:GetSpecialValueFor("clone_damage")
	end

	self.destroy_orders	=
	{
		[DOTA_UNIT_ORDER_MOVE_TO_POSITION]	= true,
		[DOTA_UNIT_ORDER_MOVE_TO_TARGET]	= true,
		[DOTA_UNIT_ORDER_ATTACK_MOVE]		= true,
		[DOTA_UNIT_ORDER_ATTACK_TARGET]		= true,
		
		[DOTA_UNIT_ORDER_STOP]				= true,
		[DOTA_UNIT_ORDER_CONTINUE]			= true,
		[DOTA_UNIT_ORDER_CAST_POSITION]		= true,
		[DOTA_UNIT_ORDER_CAST_TARGET]		= true,
		[DOTA_UNIT_ORDER_CAST_TARGET_TREE]	= true,
		[DOTA_UNIT_ORDER_CAST_TOGGLE]		= true,
		[DOTA_UNIT_ORDER_HOLD_POSITION]		= true,
		[DOTA_UNIT_ORDER_DROP_ITEM]			= true,
		[DOTA_UNIT_ORDER_GIVE_ITEM]			= true,
		[DOTA_UNIT_ORDER_PICKUP_ITEM]		= true,
		[DOTA_UNIT_ORDER_PICKUP_RUNE]		= true,
	}
end

--------------------------------------------------------------------------------

-- Needs a frame to properly retrieve the stack count, which is set in the above intrinsic modifier for Sun Catcher checking
function modifier_naruto_rendan_boost:OnIntervalThink()
	self.target = EntIndexToHScript(-self:GetStackCount())
	self:StartIntervalThink(-1)
end

--------------------------------------------------------------------------------

function modifier_naruto_rendan_boost:GetModifierMoveSpeed_AbsoluteMin()
	return self.bonus_speed
end

--------------------------------------------------------------------------------

-- "This buff lasts for up to 5 seconds, until Naruto successfully hits the rush target, or until he receives another order."
-- "Non-targeted items do not cancel the rush. Items which can be double-clicked to cast on self still count as targeted."
function modifier_naruto_rendan_boost:OnOrder(keys)
	if keys.unit == self:GetParent() and self.destroy_orders[keys.order_type] and not self.bFading then
		self:Destroy()
	end
end

--------------------------------------------------------------------------------

-- "The rush buff is also lost when Naruto gets stunned, cycloned, slept, hexed or hidden."
function modifier_naruto_rendan_boost:OnStateChanged(keys)
	if keys.unit == self:GetParent() and (self:GetParent():IsStunned() or self:GetParent():IsNightmared() or self:GetParent():IsHexed() or self:GetParent():IsOutOfGame()) then
		self:Destroy()
	end
end

--------------------------------------------------------------------------------

function modifier_naruto_rendan_boost:OnAttackStart(event)
	if not IsServer() then return end
	local attacker = event.attacker
	local target = event.target
	local ability = self:GetAbility()

	if not attacker or attacker ~= self:GetParent() or not attacker:IsRealHero() or not target then
		return 0
	end

	if not ability or ability:GetAutoCastState() or event.no_attack_cooldown then
		return 0
	end

	EmitSoundOn("Hero_Naruto.Rendan.Teleport", attacker)
	local rendan_tp_fx = ParticleManager:CreateParticle("particles/units/heroes/hero_phantom_lancer/phantomlancer_illusion_destroy.vpcf", PATTACH_CUSTOMORIGIN, nil)
	ParticleManager:SetParticleControl(rendan_tp_fx, 0, attacker:GetAbsOrigin())
	ParticleManager:ReleaseParticleIndex(rendan_tp_fx)

	local origin = target:GetAbsOrigin()
	local position = attacker:GetAbsOrigin() + (origin - attacker:GetAbsOrigin()):Normalized() * (target:GetPaddedCollisionRadius() + attacker:GetPaddedCollisionRadius() + 200)

	attacker:SetAbsOrigin(position)
	attacker:SetForwardVector(target:GetAbsOrigin())
	attacker:FaceTowards(target:GetAbsOrigin())

	if GridNav:IsBlocked(position) then
		FindClearSpaceForUnit(attacker, position, true)
	end
end

--------------------------------------------------------------------------------

function modifier_naruto_rendan_boost:OnAttackLanded(keys)
	if keys.attacker == self:GetParent() and not keys.no_attack_cooldown then		
		self:Destroy()
	end
end

--------------------------------------------------------------------------------

function modifier_naruto_rendan_boost:GetModifierPreAttack_BonusDamage()
	return self.bonus_damage
end
