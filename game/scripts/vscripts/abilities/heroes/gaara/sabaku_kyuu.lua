--[[Author: LearningDave
	Date: 04.11.2015
	Applies damage to target and fires a impact effect after x sec delay
	- Converted from datadriven to lua by EarthSalamander
	- Date: 27.04.2021
]]

LinkLuaModifier("modifier_gaara_sabaku_kyuu", "scripts/vscripts/abilities/heroes/gaara/sabaku_kyuu.lua", LUA_MODIFIER_MOTION_NONE)

gaara_sabaku_kyuu = gaara_sabaku_kyuu or class({})

function gaara_sabaku_kyuu:Precache(context)
	PrecacheResource("particle","particles/generic_gameplay/generic_silence.vpcf", context)
	PrecacheResource("particle", "particles/units/heroes/gaara/sand_explosion.vpcf", context)
	PrecacheResource("particle", "particles/econ/events/coal/coal_projectile_explosion.vpcf", context)
	PrecacheResource("particle", "particles/units/heroes/gaara/sandstorm_explosion/sandstorm_explosion.vpcf", context)
	
	PrecacheResource("soundfile", "soundevents/heroes/gaara/gaara_prison_cast.vsndevts", context)
	PrecacheResource("soundfile", "soundevents/heroes/gaara/gaara_prison_impact.vsndevts", context)
	PrecacheResource("soundfile", "soundevents/heroes/gaara/gaara_prison_talking.vsndevts", context)
end

function gaara_sabaku_kyuu:CanBeReflected(bool, target)
    if bool == true then
        if target:TriggerSpellReflect(self) then return end
    else
        --[[ simulate the cancellation of the ability if it is not reflected ]]
        ParticleManager:CreateParticle("particles/items3_fx/lotus_orb_reflect.vpcf", PATTACH_ABSORIGIN, target)
        EmitSoundOn("DOTA_Item.AbyssalBlade.Activate", target)
    end
end

function gaara_sabaku_kyuu:ProcsMagicStick()
    return true
end

function gaara_sabaku_kyuu:OnSpellStart()
	self.target = self:GetCursorTarget()

	self.target:EmitSound("gaara_prison_cast")
	self:GetCaster():EmitSound("gaara_prison_talking")

	--[[ if the target used Lotus Orb, reflects the ability back into the caster ]]
    if self.target:FindModifierByName("modifier_item_lotus_orb_active") then
        self:CanBeReflected(false, self.target)
		
        return
    end
    
    --[[ if the target has Linken's Sphere, cancels the use of the ability ]]
    if self.target:TriggerSpellAbsorb(self) then return end

	if self.target and self.target:IsAlive() and not self.target:IsOutOfGame() then
		self.target:AddNewModifier(self:GetCaster(), self, "modifier_gaara_sabaku_kyuu", {duration = self:GetSpecialValueFor("duration")})
	
		--Pocket sand bit
		self:GetCaster():FindAbilityByName("gaara_innate_passive"):ApplyPocketSandDebuff(self.target)
	end

	self.coffin_vfx = ParticleManager:CreateParticle("particles/units/heroes/gaara/gaara_sand_coffin.vpcf", PATTACH_ABSORIGIN, self.target)
	ParticleManager:SetParticleControlEnt(self.coffin_vfx, 4, self.target, PATTACH_CENTER_FOLLOW , "attach_origin", Vector(0,0,160), true)
	ParticleManager:SetParticleControl(self.coffin_vfx, 3, self:GetCaster():GetOrigin()) --TODO: change to sack attachment point
end

function gaara_sabaku_kyuu:OnChannelFinish(bInterrupted)
	local caster = self:GetCaster()

	if bInterrupted then
		if self.target and self.target:IsAlive() then
			self.target:RemoveModifierByNameAndCaster("modifier_gaara_sabaku_kyuu", caster)
		end

		ParticleManager:DestroyParticle(self.coffin_vfx, true)
	elseif self.target and self.target:IsAlive() then
		local damage = self:GetSpecialValueFor("damage") + caster:FindTalentValue("special_bonus_gaara_4")

		ApplyDamage({
			victim = self.target,
			attacker = caster,
			damage = damage,
			damage_type = self:GetAbilityDamageType(),
			ability = self
		})

		EmitSoundOn("gaara_prison_impact", self.target)
		self.target:AddNewModifier(caster, self, "modifier_stunned", {duration = self:GetSpecialValueFor("stun_duration")})
		PopupDamage(self.target, damage)

		--local enemy_loc = self:GetParent():GetAbsOrigin()
	end

	ParticleManager:ReleaseParticleIndex(self.coffin_vfx)
	local sand_back_vfx = ParticleManager:CreateParticle("particles/units/heroes/gaara/gaara_generic_sand_particles.vpcf", PATTACH_ABSORIGIN, self.target)
	ParticleManager:SetParticleControlEnt(sand_back_vfx, 4, caster, PATTACH_CENTER_FOLLOW , "attach_origin", Vector(0,0,160), true) --TODO: change to sack attachment point
	ParticleManager:SetParticleControlEnt(sand_back_vfx, 3, self.target, PATTACH_CENTER_FOLLOW , "attach_origin", Vector(0,0,160), true)
	ParticleManager:DestroyParticle(sand_back_vfx, false)
	ParticleManager:ReleaseParticleIndex(sand_back_vfx)
end

modifier_gaara_sabaku_kyuu = modifier_gaara_sabaku_kyuu or class({})

function modifier_gaara_sabaku_kyuu:IsHidden() return true end
function modifier_gaara_sabaku_kyuu:GetEffectName() return "particles/generic_gameplay/generic_stunned.vpcf" end
function modifier_gaara_sabaku_kyuu:GetEffectAttachType() return PATTACH_OVERHEAD_FOLLOW end
function modifier_gaara_sabaku_kyuu:GetOverrideAnimation() return ACT_DOTA_DISABLED end

function modifier_gaara_sabaku_kyuu:OnCreated()
	if not IsServer() then return end
	local ability = self:GetAbility()
	local parent = self:GetParent()
	local origin = parent:GetAbsOrigin()
	local channel_time = ability:GetChannelTime()

	local knockback_param = {
		should_stun = 1,
		knockback_duration = channel_time * 2,
		duration = channel_time,
		knockback_distance = 0,
		knockback_height = 200,
		center_x = origin.x,
		center_y = origin.y,
		center_z = origin.z,
	}

	parent:RemoveModifierByName("modifier_knockback")
	parent:AddNewModifier(self:GetCaster(), ability, "modifier_knockback", knockback_param)

	-- self.pfx = ParticleManager:CreateParticle("particles/units/heroes/gaara/sandsturm.vpcf", PATTACH_ABSORIGIN_FOLLOW, self:GetParent())
	-- ParticleManager:SetParticleControl(self.pfx, 1, Vector(200, 200, 0))
end


function modifier_gaara_sabaku_kyuu:OnDestroy()
	if not IsServer() then return end

	-- if self.pfx then
	-- 	ParticleManager:DestroyParticle(self.pfx, false)
	-- 	ParticleManager:ReleaseParticleIndex(self.pfx)
	-- end

	self:GetParent():RemoveModifierByNameAndCaster("modifier_knockback", self:GetCaster())
end
