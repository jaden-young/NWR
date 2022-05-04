madara_meteor = class({})

---------------------------------------------------------------------------------------------

function madara_meteor:Precache( context )
	PrecacheResource( "soundfile", "soundevents/heroes/madara/game_sounds_madara.vsndevts", context )
    PrecacheResource( "soundfile", "soundevents/heroes/madara/madara_ulti_cast_talk.vsndevts", context )
	PrecacheResource( "soundfile", "soundevents/heroes/madara/madara_ulti_impact_talk.vsndevts", context )

    PrecacheResource( "particle", "particles/generic_gameplay/generic_silence.vpcf", context )
    PrecacheResource( "particle", "particles/units/heroes/hero_invoker/invoker_chaos_meteor_fly.vpcf", context )
    PrecacheResource( "particle", "particles/units/heroes/madara/shadow_2.vpcf", context )
    PrecacheResource( "particle", "particles/units/heroes/madara/burning_tree.vpcf", context )
    PrecacheResource( "particle", "particles/units/heroes/deidara/c4_explo_base.vpcf", context )
    PrecacheResource( "particle", "particles/units/heroes/hero_jakiro/jakiro_macropyre.vpcf", context )
end

---------------------------------------------------------------------------------------------

function madara_meteor:Spawn()
	if not IsServer() then return end

	self.MeteorTracker = {}
	self.ID = -1
	self.active_id = -1
end

---------------------------------------------------------------------------------------------

function madara_meteor:GetAOERadius()
	return self:GetSpecialValueFor("radius")
end

---------------------------------------------------------------------------------------------

function madara_meteor:NewID()
	self.ID = self.ID + 1
	return self.ID
end

---------------------------------------------------------------------------------------------

function madara_meteor:OnSpellStart()
	self.active_id = self:NewID()
	self:CastMeteorShadow(nil, self:GetCursorPosition(), self.active_id)
end

---------------------------------------------------------------------------------------------

function madara_meteor:OnChannelFinish(interrupted)
	local info = self.MeteorTracker[self.active_id]
	ParticleManager:DestroyParticle(info.fx, interrupted)

	if interrupted then
		self.MeteorTracker[self.active_id] = nil
		if not self.last_interrupted or self.last_interrupted + 3 < GameRules:GetGameTime() then
			self.last_interrupted = GameRules:GetGameTime()
			local flash_fx = ParticleManager:CreateParticle("particles/units/heroes/madara/madara_meteor_channeli.vpcf", PATTACH_CUSTOMORIGIN, nil)
			ParticleManager:SetParticleControl(flash_fx, 3, info.start_pos)
			ParticleManager:ReleaseParticleIndex(flash_fx)
		end
	else
		local caster = self:GetCaster()
		self:LaunchMeteor(info.end_pos, self.active_id)
		caster:EmitSound("madara_ulti_impact_talk")

		if caster:HasShard() then
			local id = math.floor(GameRules:GetGameTime())
			Timers:CreateTimer(self:GetSpecialValueFor("shard_delay") - self:GetChannelTime(), function()
				self:CastMeteorShadow(info.start_pos, info.end_pos, id)
			end)

			Timers:CreateTimer(self:GetSpecialValueFor("shard_delay"), function()
				self:LaunchMeteor(info.end_pos, id, true)
			end)
		end
	end
end

---------------------------------------------------------------------------------------------

function madara_meteor:CastMeteorShadow(start_pos, target_point, id)
	local caster = self:GetCaster()
	local direction = (target_point - caster:GetAbsOrigin()):Normalized()
	local launch_pos = target_point + Vector(-900, 0, 2000)

	local meteor_creation_fx = ParticleManager:CreateParticle("particles/units/heroes/madara/madara_meteor_channel.vpcf", PATTACH_CUSTOMORIGIN, nil)
	ParticleManager:SetParticleControl(meteor_creation_fx, 0, launch_pos)
	ParticleManager:SetParticleControl(meteor_creation_fx, 1, launch_pos)
	ParticleManager:SetParticleControl(meteor_creation_fx, 2, Vector(self:GetChannelTime(), 0, 0))

	self.MeteorTracker[id] = {
		start_pos = launch_pos,
		fx = meteor_creation_fx,
		end_pos = target_point
	}

	EmitSoundOn("madara_ulti_cast_talk", caster)
	EmitSoundOnLocationWithCaster(launch_pos, "Hero_Madara.HeavenConcealed.Channel", caster)
end

---------------------------------------------------------------------------------------------

function madara_meteor:LaunchMeteor(target_point, id, shard_cast)
	local caster = self:GetCaster()
	local land_time = self:GetSpecialValueFor("land_time")
	local info = self.MeteorTracker[id]

	if shard_cast then
		ParticleManager:DestroyParticle(info.fx, false)
	end
	
	EmitSoundOnLocationWithCaster(info.start_pos, "Hero_Madara.HeavenConcealed.Launch", caster)

	local launch_fx = ParticleManager:CreateParticle("particles/units/heroes/madara/madara_meteor_launch.vpcf", PATTACH_CUSTOMORIGIN, nil)
	ParticleManager:SetParticleControl(launch_fx, 0, info.start_pos)
	ParticleManager:SetParticleControl(launch_fx, 1, target_point)
	ParticleManager:SetParticleControl(launch_fx, 2, Vector(land_time, 0, 0))
	ParticleManager:ReleaseParticleIndex(launch_fx)

	Timers:CreateTimer(land_time, function()
		self:Impact(target_point, id)
	end)
end

---------------------------------------------------------------------------------------------

function madara_meteor:Impact(target_point, id)
	local caster = self:GetCaster()
	local vision_distance = self:GetSpecialValueFor("vision_distance")
	local end_vision_duration = self:GetSpecialValueFor("end_vision_duration")
	local info = self.MeteorTracker[id]

	local explosion_radius = self:GetSpecialValueFor("radius")
	local damage_table = {
		attacker = self:GetCaster(),
		damage = self:GetSpecialValueFor("damage"),
		damage_type = self:GetAbilityDamageType(),
		ability = self,
	}

	local enemies = FindUnitsInRadius(
		caster:GetTeamNumber(),	-- int, your team number
		target_point,	-- point, center point
		nil,	-- handle, cacheUnit. (not known)
		explosion_radius,	-- float, radius. or use FIND_UNITS_EVERYWHERE
		DOTA_UNIT_TARGET_TEAM_ENEMY,	-- int, team filter
		DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_BASIC,	-- int, type filter
		DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES,	-- int, flag filter
		0,	-- int, order filter
		false	-- bool, can grow cache
	)

	for _,enemy in pairs(enemies) do
		damage_table.victim = enemy
		ApplyDamage( damage_table )
		enemy:AddNewModifier(self:GetCaster(), self, "modifier_stunned", {duration = self:GetSpecialValueFor("stun_duration")})
	end

	self:CheckTrees(target_point, explosion_radius)

	local explosion_vfx = ParticleManager:CreateParticle("particles/units/heroes/hero_gyrocopter/gyro_calldown_explosion.vpcf", PATTACH_ABSORIGIN, caster)
	ParticleManager:SetParticleControl(explosion_vfx, 3, target_point)
	ParticleManager:SetParticleControl(explosion_vfx, 5, Vector(explosion_radius, 0, 0))
	ParticleManager:ReleaseParticleIndex(explosion_vfx)

	explosion_vfx = ParticleManager:CreateParticle("particles/units/heroes/madara/madara_meteor_impact.vpcf", PATTACH_ABSORIGIN, caster)
	ParticleManager:SetParticleControl(explosion_vfx, 0, target_point)
	ParticleManager:SetParticleControl(explosion_vfx, 1, Vector(explosion_radius, 0, 0))
	ParticleManager:ReleaseParticleIndex(explosion_vfx)

	AddFOWViewer(caster:GetTeamNumber(), target_point, vision_distance, end_vision_duration, false)
	EmitSoundOnLocationWithCaster(target_point, "Hero_Madara.HeavenConcealed.Impact", caster)
	self.MeteorTracker[id] = nil
end

---------------------------------------------------------------------------------------------

function madara_meteor:CheckTrees(pos, radius)
	local ability =  self:GetCaster():FindAbilityByName("madara_wood_release")

	if ability and ability:IsTrained() then
		local trees = GridNav:GetAllTreesAroundPoint(pos, radius, false) 
		for _, tree in pairs(trees) do
			ability:BurnTree(tree)
		end
	end
end
