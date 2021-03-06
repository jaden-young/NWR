hidan_death_possession_blood = class({})
LinkLuaModifier("modifier_death_possession_blood_caster_on_attack", "abilities/heroes/hidan/death_possession_blood", LUA_MODIFIER_MOTION_NONE)
LinkLuaModifier("modifier_death_possession_blood_target", "abilities/heroes/hidan/death_possession_blood", LUA_MODIFIER_MOTION_NONE)
LinkLuaModifier("modifier_death_possession_blood_dummy_aura", "abilities/heroes/hidan/death_possession_blood", LUA_MODIFIER_MOTION_NONE)
LinkLuaModifier("modifier_death_possession_blood_dummy_aura_inside_ring", "abilities/heroes/hidan/death_possession_blood", LUA_MODIFIER_MOTION_NONE)
LinkLuaModifier("modifier_death_possession_blood_caster_buff", "abilities/heroes/hidan/death_possession_blood", LUA_MODIFIER_MOTION_NONE)
LinkLuaModifier("modifier_death_possession_blood_caster_status", "abilities/heroes/hidan/death_possession_blood", LUA_MODIFIER_MOTION_NONE)

function hidan_death_possession_blood:Precache(context)
	PrecacheResource("soundfile",  "soundevents/heroes/hidan_ulti.vsndevts", context)
	PrecacheResource("soundfile",  "soundevents/heroes/hidan/hidan_ulti_cast_talking.vsndevts", context)
	PrecacheResource("soundfile",  "soundevents/heroes/hidan/hidan_curse_cast.vsndevts", context)

	PrecacheResource("particle",   "particles/units/heroes/hidan/hidan_blood_possession_ring.vpcf", context)
	PrecacheResource("particle",   "particles/units/heroes/hidan/ritual_debuff_core.vpcf", context)
end

function hidan_death_possession_blood:CastFilterResult()
	return self:GetCaster():HasModifier("modifier_death_possession_blood_caster_status") and UF_SUCCESS or UF_FAIL_CUSTOM
end

function hidan_death_possession_blood:GetCustomCastError()
	return "#dota_hud_error_hidan_no_marked_target"
end

function hidan_death_possession_blood:OnSpellStart()
	local caster = self:GetCaster()
	local duration = self:GetSpecialValueFor("duration")
	local target = self.current_blood_target

	caster:StartGesture(ACT_DOTA_CAST_ABILITY_6)
	Timers:CreateTimer( 0.5, function()
		caster:FadeGesture(ACT_DOTA_CAST_ABILITY_6)
	end)
	
	caster:SetModel("models/striker_hidan/striker_hidan_transformation_base.vmdl")
	caster:SetOriginalModel("models/striker_hidan/striker_hidan_transformation_base.vmdl")

	caster:EmitSound("hidan_curse_cast")

	--Learn Self Pain ability
	caster:FindAbilityByName("hidan_self_pain"):SetLevel(self:GetLevel())

	-- Dummy

	local thinker = CreateModifierThinker(caster, self, "modifier_death_possession_blood_dummy_aura", {duration = duration}, caster:GetAbsOrigin(), caster:GetTeamNumber(), false)

	-- Apply buff to caster + refresh mark
	caster:AddNewModifier(caster, self, "modifier_death_possession_blood_caster_buff", {duration = duration, id = target:entindex(), thinker = thinker:entindex()})
	target:AddNewModifier(caster, self, "modifier_death_possession_blood_target", {duration = duration})

	-- Sounds
	caster:EmitSound("hidan_ulti_cast_talking")
	
	Timers:CreateTimer(duration, function ()
	    caster:FindAbilityByName("hidan_self_pain"):SetLevel(0)
		caster:SetModel("models/striker_hidan/striker_hidan_base.vmdl")
	    caster:SetOriginalModel("models/striker_hidan/striker_hidan_base.vmdl")
	end)
end

function hidan_death_possession_blood:GetIntrinsicModifierName()
	return "modifier_death_possession_blood_caster_on_attack"
end

modifier_death_possession_blood_caster_on_attack = class({})

function modifier_death_possession_blood_caster_on_attack:IsHidden() return true end
function modifier_death_possession_blood_caster_on_attack:IsPassive() return true end

function modifier_death_possession_blood_caster_on_attack:DeclareFunctions()
	return {
		MODIFIER_EVENT_ON_ATTACK_LANDED
	}
end

function modifier_death_possession_blood_caster_on_attack:OnCreated()
	-- Ability properties
	self.caster = self:GetCaster()
	self.ability = self:GetAbility()
	self.stacks = 0

	if not IsServer() then return end
	self:SetHasCustomTransmitterData( true )

end

function modifier_death_possession_blood_caster_on_attack:AddCustomTransmitterData()
	-- on server
	local data = {
		current_blood_target_name = self.current_blood_target_name
	}

	return data
end

function modifier_death_possession_blood_caster_on_attack:HandleCustomTransmitterData( data )
	-- on client
	self.current_blood_target_name = data.current_blood_target_name
end


function modifier_death_possession_blood_caster_on_attack:OnAttackLanded( attack_event )
	if attack_event.attacker ~= self:GetAbility():GetCaster() then
		return
	end

	local ability = self:GetAbility()
	local caster = ability:GetCaster()
	local mark_duration = ability:GetSpecialValueFor("mark_duration")

	if caster:HasModifier("modifier_death_possession_blood_caster_buff") and attack_event.target ~= ability.current_blood_target then
		return
	end


	if ability.current_blood_target ~= nil then
		ability.current_blood_target:RemoveModifierByName("modifier_death_possession_blood_target")
	end

	if attack_event.target:IsHero() and attack_event.fail_type == DOTA_ATTACK_RECORD_FAIL_NO then
		-- Set modifier to the target
		ability.current_blood_target = attack_event.target
		self.current_blood_target_name = attack_event.target:GetUnitName()
		attack_event.target:AddNewModifier(caster, ability, "modifier_death_possession_blood_target", {duration = mark_duration})

		-- Set status for caster
		local target_name = attack_event.target:GetUnitName()
		caster:AddNewModifier(caster, ability, "modifier_death_possession_blood_caster_status", {duration = mark_duration, target_name = target_name})
	end

	return nil
	
end


modifier_death_possession_blood_target = class({})

function modifier_death_possession_blood_target:IsBuff()
	return false
end

function modifier_death_possession_blood_target:IsHidden()
	return false
end

function modifier_death_possession_blood_target:IsPurgable()
	return false
end


function modifier_death_possession_blood_target:OnCreated(event)
	if IsServer() then
		local target_vfx = ParticleManager:CreateParticle("particles/units/heroes/hidan/ritual_debuff_core.vpcf", PATTACH_CUSTOMORIGIN_FOLLOW, self:GetAbility():GetCaster())
		ParticleManager:SetParticleControlEnt(target_vfx, 0, self:GetParent(), PATTACH_ABSORIGIN_FOLLOW, "attach_origin", self:GetParent():GetAbsOrigin(), true)
		ParticleManager:SetParticleControlEnt(target_vfx, 1, self:GetParent(), PATTACH_ABSORIGIN_FOLLOW, "attach_origin", self:GetParent():GetOrigin(), true)
		self:AddParticle(target_vfx, false, false, -1, false, false)

	end
end

function modifier_death_possession_blood_target:OnRemoved()
	self:GetAbility().current_blood_target = nil
	local caster = self:GetAbility():GetCaster()
	if IsServer() and caster:HasModifier("modifier_death_possession_blood_caster_status") then
		caster:RemoveModifierByName("modifier_death_possession_blood_caster_status")
	end
end


modifier_death_possession_blood_caster_status = class({})

function modifier_death_possession_blood_caster_status:IsBuff()
	return true
end

function modifier_death_possession_blood_caster_status:IsHidden()
	return true
end

function modifier_death_possession_blood_caster_status:IsPurgable()
	return false
end

function modifier_death_possession_blood_caster_status:OnCreated(kv)
	self.texture = kv.target_name
end

function modifier_death_possession_blood_caster_status:GetTexture()
	return "npc_dota_hero_yondaime"
	-- return self.texture
end


modifier_death_possession_blood_dummy_aura = class({})

function modifier_death_possession_blood_dummy_aura:IsBuff()
	return true
end

function modifier_death_possession_blood_dummy_aura:IsHidden()
	return false
end

function modifier_death_possession_blood_dummy_aura:IsPurgable()
	return false
end

function modifier_death_possession_blood_dummy_aura:IsAura()
	return true
end

function modifier_death_possession_blood_dummy_aura:CheckState()
	return {
			[MODIFIER_STATE_NO_UNIT_COLLISION] = true,
			[MODIFIER_STATE_NO_TEAM_MOVE_TO] = true,
			[MODIFIER_STATE_NO_TEAM_SELECT] = true,
			[MODIFIER_STATE_COMMAND_RESTRICTED] = true,
			[MODIFIER_STATE_ATTACK_IMMUNE] = true,
			[MODIFIER_STATE_MAGIC_IMMUNE] = true,
			[MODIFIER_STATE_INVULNERABLE] = true,
			[MODIFIER_STATE_NOT_ON_MINIMAP] = true,
			[MODIFIER_STATE_UNSELECTABLE] = true,
			[MODIFIER_STATE_OUT_OF_GAME] = true,
			[MODIFIER_STATE_NO_HEALTH_BAR] = true,
	}
end

function modifier_death_possession_blood_dummy_aura:OnCreated( kv )
	local caster = self:GetAbility():GetCaster()
	self.aura_radius = self:GetAbility():GetSpecialValueFor( "radius" )
	self.ring_vfx = ParticleManager:CreateParticle("particles/units/heroes/hidan/hidan_blood_possession_ring.vpcf",
	PATTACH_POINT , caster)
	ParticleManager:SetParticleControl(self.ring_vfx, 0, caster:GetAbsOrigin())
	ParticleManager:SetParticleControl(self.ring_vfx, 1, Vector(self.aura_radius, 1, 1))

end

function modifier_death_possession_blood_dummy_aura:OnRemoved()
	ParticleManager:DestroyParticle(self.ring_vfx, false)
	ParticleManager:ReleaseParticleIndex(self.ring_vfx)

end

function modifier_death_possession_blood_dummy_aura:GetModifierAura()
	return "modifier_death_possession_blood_dummy_aura_inside_ring"
end

function modifier_death_possession_blood_dummy_aura:GetAuraRadius()
	return self.aura_radius
end

function modifier_death_possession_blood_dummy_aura:GetAuraSearchType()
	return DOTA_UNIT_TARGET_HERO
end

function modifier_death_possession_blood_dummy_aura:GetAuraSearchTeam()
	return DOTA_UNIT_TARGET_TEAM_FRIENDLY
end

function modifier_death_possession_blood_dummy_aura:GetAuraSearchFlags()
	return DOTA_UNIT_TARGET_FLAG_NONE 
end


modifier_death_possession_blood_dummy_aura_inside_ring = class({})

function modifier_death_possession_blood_dummy_aura:IsBuff()
	return true
end

function modifier_death_possession_blood_dummy_aura:IsHidden()
	return false
end

function modifier_death_possession_blood_dummy_aura:IsPurgable()
	return false
end

function modifier_death_possession_blood_dummy_aura:IsAura()
	return true
end


modifier_death_possession_blood_caster_buff = class({})

function modifier_death_possession_blood_caster_buff:IsBuff() 		return true end
function modifier_death_possession_blood_caster_buff:IsHidden()		return false end
function modifier_death_possession_blood_caster_buff:IsPurgable() 	return false end

function modifier_death_possession_blood_caster_buff:OnCreated(kv)
	if not IsServer() then return end
	self.target = EntIndexToHScript(kv.id)
	self.thinker = EntIndexToHScript(kv.thinker)
end

function modifier_death_possession_blood_caster_buff:GetEffectName()
	return "particles/units/heroes/hidan/ritual_owner.vpcf"
end

function modifier_death_possession_blood_caster_buff:GetEffectAttachType()
	return PATTACH_ABSORIGIN_FOLLOW 
end

function modifier_death_possession_blood_caster_buff:GetStatusEffectName()
	return "particles/units/heroes/hidan/ritual_self_status_effect.vpcf"
end

function modifier_death_possession_blood_caster_buff:StatusEffectPriority()
	return MODIFIER_PRIORITY_ULTRA 
end

function modifier_death_possession_blood_caster_buff:DeclareFunctions()
	return {
		MODIFIER_EVENT_ON_TAKEDAMAGE,
		MODIFIER_EVENT_ON_DEATH
	}
end

function modifier_death_possession_blood_caster_buff:OnDeath(event)
	if not IsServer() then return end

	if event.unit == self.target then
		self.thinker:Destroy()
		self:Destroy()
	end
end

function modifier_death_possession_blood_caster_buff:OnTakeDamage(attack_event)

	if attack_event.unit ~= self:GetAbility():GetCaster() then return end

		local ability = self:GetAbility()
		local caster = ability:GetCaster()
	

	if ability.current_blood_target ~= nil then

		local damage_multiplier = ability:GetSpecialValueFor("returned_damage_outside_percentage") / 100
		if caster:HasModifier("modifier_death_possession_blood_dummy_aura_inside_ring") then 
			damage_multiplier = ability:GetSpecialValueFor("returned_damage_inside_percentage") / 100
		end

		local damage_table = {
			victim = ability.current_blood_target,
			attacker = caster,
			damage = attack_event.damage * damage_multiplier,
			damage_type = attack_event.damage_type,
			damage_flags = attack_event.damage_flags,
			ability = ability,
		}

		ApplyDamage(damage_table)
	end
end