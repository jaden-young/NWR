kakashi_chidori = kakashi_chidori or class({})

LinkLuaModifier("modifier_kakashi_lighting_charge", "scripts/vscripts/abilities/heroes/kakashi/modifiers/modifier_kakashi_lighting_charge.lua", LUA_MODIFIER_MOTION_NONE)

function kakashi_chidori:Precache(context)
	PrecacheResource("soundfile",  "soundevents/heroes/kakashi/kakashi_raikiri_cast.vsndevts", context)
	PrecacheResource("soundfile",  "soundevents/heroes/kakashi/kakashi_raikiri_loop.vsndevts", context)
	PrecacheResource("soundfile",  "soundevents/heroes/kakashi/kakashi_raikiri_impact.vsndevts", context)
	PrecacheResource("soundfile",  "soundevents/heroes/kakashi/kakashi_raikiri_cast_talking.vsndevts", context)
	PrecacheResource("soundfile",  "soundevents/heroes/kakashi/kakashi_raikiri_impact_talking.vsndevts", context)

	PrecacheResource("particle",   "particles/units/heroes/hero_sven/sven_storm_bolt_projectile_explosion.vpcf", context)
	PrecacheResource("particle",   "particles/units/heroes/hero_razor/razor_ambient_g.vpcf", context)
	PrecacheResource("particle",   "particles/units/heroes/hero_sven/sven_spell_storm_bolt_projectile_lightning_b.vpcf", context)
	PrecacheResource("particle",   "particles/units/heroes/kakashi/chidori.vpcf", context)
end		

function kakashi_chidori:GetCooldown(iLevel)
	return self.BaseClass.GetCooldown(self, iLevel)
end

function kakashi_chidori:GetCastRange(location, target)
	return self:GetSpecialValueFor("range")
end

function kakashi_chidori:CanBeReflected(bool, target)
    if bool == true then
        if target:TriggerSpellReflect(self) then return end
    else
        --[[ simulate the cancellation of the ability if it is not reflected ]]
		ParticleManager:CreateParticle("particles/items3_fx/lotus_orb_reflect.vpcf", PATTACH_ABSORIGIN, target)
        EmitSoundOn("DOTA_Item.AbyssalBlade.Activate", target)
    end
end

function kakashi_chidori:ProcsMagicStick()
	return true
end

function kakashi_chidori:OnSpellStart()
   
	local caster = self:GetCaster()
	self.caster = caster
	local target = self:GetCursorTarget()
	self.target = target
	self.ability = self
	
	--[[ if the target used Lotus Orb, reflects the ability back into the caster ]]
    if target:FindModifierByName("modifier_item_lotus_orb_active") then
        self:CanBeReflected(false, target)
        
        return
    end
    
    --[[ if the target has Linken's Sphere, cancels the use of the ability ]]
    if target:TriggerSpellAbsorb(self) then return end

	caster:StartGesture(ACT_DOTA_CAST_ABILITY_5)
	caster:StartGestureWithPlaybackRate(ACT_DOTA_CAST_ABILITY_4, 0.3)
	self.chidori_particle = ParticleManager:CreateParticle("particles/units/heroes/kakashi/chidori.vpcf", PATTACH_POINT_FOLLOW, caster)
	ParticleManager:SetParticleControlEnt(self.chidori_particle, 0, caster, PATTACH_POINT_FOLLOW, "attach_right_hand", caster:GetAbsOrigin(), false)
	
	EmitSoundOn("kakashi_raikiri_cast_talking", caster)
	EmitSoundOn("kakashi_raikiri_cast", caster)
	
end

function kakashi_chidori:OnChannelFinish(bInterrupted)

	local caster = self:GetCaster()
	local target = self.target
	local ability_level = self:GetLevel()
	local velocity = self:GetSpecialValueFor("speed")

	if bInterrupted == true then
		self.caster:StopSound("kakashi_raikiri_cast")
		--self.target:StopSound("kakashi_raikiri_impact")
	    self.caster:RemoveGesture(ACT_DOTA_CAST_ABILITY_4)
	    self.caster:RemoveGesture(ACT_DOTA_CHANNEL_ABILITY_4)
	    self.caster:RemoveGesture(ACT_DOTA_CAST_ABILITY_5)
		if self.chidori_particle ~= nil then
		    ParticleManager:DestroyParticle(self.chidori_particle, true)
		    ParticleManager:ReleaseParticleIndex(self.chidori_particle)
		end
		if self.caster:FindModifierByName("modifier_stunned") then
		    self.caster:RemoveModifierByName("modifier_stunned")
		end
		self:RemovePhysics(self.caster)
		self.ability:EndCooldown()
		return
	else
		Timers:CreateTimer(0.1, function() -- 2 = delay before Kakashi runs at the target
			--EmitSoundOn("kakashi_raikiri_loop", caster)
			
			caster:FadeGesture(ACT_DOTA_CAST_ABILITY_4)
			caster:StartGestureWithPlaybackRate(ACT_DOTA_CHANNEL_ABILITY_5, 1)
			
			self:AddPhysics(caster)
		
			local vector = target:GetAbsOrigin() - caster:GetAbsOrigin()
			local direction = vector:Normalized()
			caster:SetPhysicsVelocity(direction * velocity)
			caster:SetForwardVector(direction)
			if target:IsOutOfGame() or not target:IsAlive() then
				self.caster:StopSound("kakashi_raikiri_cast")
				--self.target:StopSound("kakashi_raikiri_impact")
				self.caster:RemoveGesture(ACT_DOTA_CAST_ABILITY_4)
				self.caster:RemoveGesture(ACT_DOTA_CHANNEL_ABILITY_4)
				self.caster:RemoveGesture(ACT_DOTA_CAST_ABILITY_5)
				ParticleManager:DestroyParticle(self.chidori_particle, true)
				ParticleManager:ReleaseParticleIndex(self.chidori_particle)
				if self.caster:FindModifierByName("modifier_stunned") then
					self.caster:RemoveModifierByName("modifier_stunned")
				end
				self:RemovePhysics(self.caster)
				return nil
			elseif vector:Length2D() <= 2 * target:GetPaddedCollisionRadius() then
				local enemy_loc = target:GetAbsOrigin()
				local impact_pfx = ParticleManager:CreateParticle("particles/units/heroes/hero_sven/sven_storm_bolt_projectile_explosion.vpcf", PATTACH_POINT_FOLLOW, target)
				ParticleManager:SetParticleControl(impact_pfx, 0, enemy_loc)
				ParticleManager:SetParticleControlEnt(impact_pfx, 3, target, PATTACH_POINT_FOLLOW, "attach_origin", enemy_loc, true)
				self.caster:StopSound("kakashi_raikiri_cast")
				--self.target:StopSound("kakashi_raikiri_impact")
				self.caster:RemoveGesture(ACT_DOTA_CAST_ABILITY_4)
				self.caster:RemoveGesture(ACT_DOTA_CHANNEL_ABILITY_5)
				self.caster:RemoveGesture(ACT_DOTA_CAST_ABILITY_5)
				ParticleManager:DestroyParticle(self.chidori_particle, true)
				ParticleManager:ReleaseParticleIndex(self.chidori_particle)
				if self.caster:FindModifierByName("modifier_stunned") then
					self.caster:RemoveModifierByName("modifier_stunned")
				end
				self:RemovePhysics(self.caster)
	
				local damage = self:GetSpecialValueFor("damage")
	
				local ability4 = caster:FindAbilityByName("special_bonus_kakashi_4")
				if ability4 ~= nil then
					if ability4:IsTrained() then
						damage = damage + 420
					end
				end
	
				local damageTable = {
					victim = target,
					attacker = caster,
					damage = damage,
					damage_type = self:GetAbilityDamageType()
				}
				if not target:IsMagicImmune() then
					ApplyDamage( damageTable )
					target:AddNewModifier(caster, self, "modifier_kakashi_lighting_charge", { duration = 1 })
				end
				FindClearSpaceForUnit( caster, caster:GetAbsOrigin(), false )
				--caster:StopSound("kakashi_raikiri_loop")
				EmitSoundOn("kakashi_raikiri_impact", target)
				EmitSoundOn("kakashi_raikiri_impact_talking", caster)
				return nil
			end
			return 0.03
		end)
	end
end

function kakashi_chidori:AddPhysics(caster)
	Physics:Unit(caster)
	caster:PreventDI(true)
	caster:SetAutoUnstuck(false)
	caster:SetNavCollisionType(PHYSICS_NAV_NOTHING)
	caster:FollowNavMesh(false)	
end

function kakashi_chidori:RemovePhysics(caster)
	--caster:SetPhysicsAcceleration(Vector(0,0,0))
	caster:SetPhysicsVelocity(Vector(0,0,0))
	caster:OnPhysicsFrame(nil)
	caster:PreventDI(false)
	caster:SetAutoUnstuck(true)
	caster:FollowNavMesh(true)
end
