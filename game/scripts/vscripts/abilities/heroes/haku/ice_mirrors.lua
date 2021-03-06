LinkLuaModifier("modifier_haku_mirror_caster", "abilities/heroes/haku/ice_mirrors", LUA_MODIFIER_MOTION_NONE)
LinkLuaModifier("modifier_haku_mirror_mirror", "abilities/heroes/haku/ice_mirrors", LUA_MODIFIER_MOTION_NONE)

haku_ice_mirrors = haku_ice_mirrors or class({})

function haku_ice_mirrors:Precache(context)
	PrecacheResource("soundfile",  "soundevents/game_sounds_heroes/game_sounds_ancient_apparition.vsndevts", context)
	PrecacheResource("soundfile",  "soundevents/heroes/haku/haku_mirrors_cast.vsndevts", context)
	PrecacheResource("soundfile",  "soundevents/heroes/haku/haku_ulti_talking.vsndevts", context)
	PrecacheResource("particle",   "particles/units/heroes/haku/wyvern_cold_embrace_buff.vpcf", context)
	PrecacheResource("particle",   "particles/units/heroes/haku/mirror_destroy.vpcf", context)
end

function haku_ice_mirrors:OnAbilityPhaseStart()
	self:GetCaster():EmitSound("haku_mirrors_cast")
	self:GetCaster():EmitSound("haku_ulti_talking")
	return true
end

function haku_ice_mirrors:ProcsMagicStick()
    return true
end

function haku_ice_mirrors:OnSpellStart()
	if not IsServer() then return end
	local attack_min = self:GetSpecialValueFor("attack_min") + self:GetCaster():FindTalentValue("special_bonus_haku_5")	
	local attack_max = self:GetSpecialValueFor("attack_max") + self:GetCaster():FindTalentValue("special_bonus_haku_5")
	local health = self:GetSpecialValueFor("hp")
	local radius = self:GetSpecialValueFor("radius")
	local duration = self:GetSpecialValueFor("duration")
	local count = self:GetSpecialValueFor("count")
	self.mirrors = {}

	self:GetCaster():AddNewModifier(self:GetCaster(), self, "modifier_haku_mirror_caster", {duration = duration})
	self:GetCaster():EmitSound("Hero_Ancient_Apparition.IceVortex")

	local r = radius / 2

	GridNav:DestroyTreesAroundPoint(self:GetCaster():GetAbsOrigin(), radius, true)

	for i = 1, count do
		local posX = self:GetCaster():GetAbsOrigin().x + r * math.cos((math.pi * 2 / count) * i)
		local posY = self:GetCaster():GetAbsOrigin().y + r * math.sin((math.pi * 2 / count) * i)
		local mirror_position = Vector(posX, posY, 0)

		local mirror = CreateUnitByName("npc_haku_mirror", mirror_position, true, self:GetCaster(), self:GetCaster(), self:GetCaster():GetTeamNumber())

		if mirror then
			mirror:SetHullRadius(48)
			FindClearSpaceForUnit(mirror, mirror_position, false)
			mirror:SetBaseDamageMin(attack_min)
			mirror:SetBaseDamageMax(attack_max)
			mirror:SetBaseMaxHealth(health)
			mirror:SetMaxHealth(health)
			mirror:SetHealth(health)
			mirror:SetOwner(self:GetCaster())
			mirror:SetControllableByPlayer(self:GetCaster():GetPlayerID(), true)

			mirror:AddNewModifier(mirror, self, "modifier_haku_mirror_mirror", {duration = duration})
			mirror:AddNewModifier(mirror, self, "modifier_kill", {duration = duration})

			if self:GetLevel() == 2 then
				mirror:CreatureLevelUp(1)
			end

			if self:GetLevel() == 3 then
				mirror:CreatureLevelUp(2)
			end

			local innate_passive_level = self:GetCaster():FindAbilityByName("haku_innate_passive"):GetLevel()
 
			-- mirror:AddNewModifier(self:GetCaster(), endless_wounds_ability, "modifier_haku_innate_passive_intrinsic",{})
			-- local innate_passive_ability = mirror:AddAbility("haku_innate_passive")
			-- print(innate_passive_level)
			-- innate_passive_ability:SetLevel(innate_passive_level)


			table.insert(self.mirrors, mirror)
		end
	end
end

modifier_haku_mirror_caster = modifier_haku_mirror_caster or class({})

function modifier_haku_mirror_caster:IsHidden() return true end

function modifier_haku_mirror_caster:CheckState() return {
	[MODIFIER_STATE_COMMAND_RESTRICTED] = true,
	[MODIFIER_STATE_STUNNED] = true,
	[MODIFIER_STATE_INVULNERABLE] = true,
	[MODIFIER_STATE_NO_UNIT_COLLISION] = true,
	[MODIFIER_STATE_OUT_OF_GAME] = true,
	[MODIFIER_STATE_NO_HEALTH_BAR] = true,
} end

function modifier_haku_mirror_caster:OnCreated()
	if not IsServer() then return end
	self:GetParent():AddNoDraw()
end

function modifier_haku_mirror_caster:OnRemoved()
	if not IsServer() then return end

	self:GetParent():RemoveNoDraw()
end

modifier_haku_mirror_mirror = modifier_haku_mirror_mirror or class({})

function modifier_haku_mirror_mirror:IsHidden() return true end

function modifier_haku_mirror_mirror:DeclareFunctions() return {
	MODIFIER_EVENT_ON_DEATH,
	MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
	MODIFIER_EVENT_ON_ATTACK_LANDED,
	MODIFIER_EVENT_ON_TAKEDAMAGE,
} end

function modifier_haku_mirror_mirror:CheckState() return {
	[MODIFIER_STATE_MAGIC_IMMUNE] = true,
} end

function modifier_haku_mirror_mirror:OnCreated()
	if not IsServer() then return end
	self.pfx = ParticleManager:CreateParticle("particles/units/heroes/haku/wyvern_cold_embrace_buff.vpcf", PATTACH_ABSORIGIN, self:GetParent())
	ParticleManager:SetParticleControl(self.pfx, 0, self:GetParent():GetAbsOrigin())
	ParticleManager:SetParticleControl(self.pfx, 1, self:GetParent():GetAbsOrigin())
	ParticleManager:SetParticleControl(self.pfx, 2, self:GetParent():GetAbsOrigin())
end

function modifier_haku_mirror_mirror:OnDeath(keys)
	if not IsServer() then return end
	if keys.unit ~= self:GetParent() then return end

	if self.pfx then
		ParticleManager:DestroyParticle(self.pfx, false)
		ParticleManager:ReleaseParticleIndex(self.pfx)
	end

	local explosion = ParticleManager:CreateParticle("particles/units/heroes/haku/mirror_destroy.vpcf", PATTACH_ABSORIGIN, self:GetParent())
	ParticleManager:SetParticleControl(explosion, 0, self:GetParent():GetAbsOrigin())
	ParticleManager:ReleaseParticleIndex(explosion)

	if self:GetRemainingTime() <= 0 then
		return
	end

	local should_die = true

	for k, v in pairs(self:GetAbility().mirrors) do
		if not v:IsNull() then
			if v:IsAlive() then
				should_die = false
				break
			end
		end
	end

	if should_die and keys.attacker then
		self:GetAbility():GetCaster():Kill(nil, keys.attacker)
	end
	
	Timers:CreateTimer(0.2, function()
	    self:GetParent():Destroy()
	end)
end

function modifier_haku_mirror_mirror:GetModifierIncomingDamage_Percentage()
	return -100
end

function modifier_haku_mirror_mirror:OnTakeDamage(params)
    if not IsServer() then return end

	if params.unit == self:GetParent() then
		if params.damage > 0 then
			local damageTable = {
				victim = params.unit,
				damage = 1,
				damage_type = DAMAGE_TYPE_PURE,
				attacker = params.attacker,
				ability = self:GetAbility()
			}

			ApplyDamage(damageTable)
		end
	end
   
end

function modifier_haku_mirror_mirror:OnAttackLanded(params) -- health handling
	if not IsServer() then return end

	if params.target == self:GetParent() then
		local damage = 1

		if self:GetParent():GetHealth() > damage then
			self:GetParent():SetHealth( self:GetParent():GetHealth() - damage)
		else
			self:GetParent():Kill(nil, params.attacker)
		end
	end

	if params.attacker == self:GetParent() then
		local innate_passive_ability = self:GetParent():GetOwner():FindAbilityByName("haku_innate_passive")
		local stacks_to_apply = innate_passive_ability:GetSpecialValueFor("stacks_per_attack")
		innate_passive_ability:ApplyStacks(params.target, stacks_to_apply)
	end
end