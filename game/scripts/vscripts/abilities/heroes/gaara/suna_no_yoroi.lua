LinkLuaModifier("modifier_suna_no_yoroi", 		"scripts/vscripts/abilities/heroes/gaara/suna_no_yoroi.lua", LUA_MODIFIER_MOTION_NONE)
LinkLuaModifier("modifier_suna_no_yoroi_shard", "scripts/vscripts/abilities/heroes/gaara/suna_no_yoroi.lua", LUA_MODIFIER_MOTION_NONE)
--------------------------------------------------------------------------------------------------------------------------------------

gaara_suna_no_yoroi = gaara_suna_no_yoroi or class({})

function gaara_suna_no_yoroi:Precache(context)
	PrecacheResource("particle", "particles/units/heroes/gaara/armor/gaara_mana_shield.vpcf", context)
	PrecacheResource("particle", "particles/units/heroes/gaara/armor/gaara_mana_shield_cast.vpcf", context)
	PrecacheResource("particle", "particles/units/heroes/gaara/armor/gaara_mana_shield_impact.vpcf", context)
	PrecacheResource("particle", "particles/units/heroes/gaara/armor/gaara_mana_shield_end.vpcf", context)
	PrecacheResource("soundfile", "soundevents/game_sounds_heroes/game_sounds_medusa.vsndevts", context)
end

function gaara_suna_no_yoroi:OnSpellStart()
	local caster = self:GetCaster()
	local target = self:GetCursorTarget()

	target:AddNewModifier(caster, self, "modifier_suna_no_yoroi", {duration = self:GetSpecialValueFor("shield_duration")})

	if caster:HasShard() then
		target:AddNewModifier(caster, self, "modifier_suna_no_yoroi_shard", {duration = self:GetSpecialValueFor("shard_immunity_duration")})
	end
end

modifier_suna_no_yoroi = modifier_suna_no_yoroi or class({})

function modifier_suna_no_yoroi:IsPurgable() return false end
function modifier_suna_no_yoroi:GetEffectName() return "particles/units/heroes/gaara/armor/gaara_mana_shield.vpcf" end

function modifier_suna_no_yoroi:DeclareFunctions() 
	return {
		MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
	} 
end

function modifier_suna_no_yoroi:OnCreated()
	if not IsServer() then return end
	
	ParticleManager:CreateParticle("particles/units/heroes/gaara/armor/gaara_mana_shield_cast.vpcf", PATTACH_ABSORIGIN_FOLLOW, self:GetParent())
	self:GetParent():EmitSound("Hero_Medusa.ManaShield.On")
	
	self.ability = self:GetAbility()
	self.caster = self.ability:GetCaster()
	self.damage_per_mana = self.ability:GetSpecialValueFor("damage_per_mana") + self.caster:FindTalentValue("special_bonus_gaara_1")
	if self.caster == self:GetParent() then
		self.absorption_tooltip = self.ability:GetSpecialValueFor("absorption_tooltip")
	else
		self.absorption_tooltip = self.ability:GetSpecialValueFor("absorption_tooltip_allies")
	end
end

function modifier_suna_no_yoroi:OnDestroy()
	if not IsServer() then return end
	ParticleManager:CreateParticle("particles/units/heroes/gaara/armor/gaara_mana_shield_end.vpcf", PATTACH_ABSORIGIN_FOLLOW, self:GetParent())
	self:GetParent():EmitSound("Hero_Medusa.ManaShield.Off")
end

function modifier_suna_no_yoroi:GetModifierIncomingDamage_Percentage(keys)
	if not IsServer() then return end
	local parent = self:GetParent()

	if keys.damage_type == DAMAGE_TYPE_PHYSICAL and parent:HasModifier("modifier_suna_no_yoroi_shard") then return end
	
	-- "While spell immune, Mana Shield does not react on magical damage."
	if not (keys.damage_type == DAMAGE_TYPE_MAGICAL and parent:IsMagicImmune()) and self.caster.GetMana then
		-- Calculate how much mana will be used in attempts to block some damage
		local mana_to_block	= keys.original_damage * self.absorption_tooltip * 0.01 / self.damage_per_mana

		if mana_to_block >= parent:GetMana() then
			parent:EmitSound("Hero_Medusa.ManaShield.Proc")

			local shield_particle = ParticleManager:CreateParticle("particles/units/heroes/gaara/armor/gaara_mana_shield_impact.vpcf", PATTACH_ABSORIGIN_FOLLOW, self:GetParent())
			ParticleManager:ReleaseParticleIndex(shield_particle)
		end			

		local mana_before = self.caster:GetMana()
		self.caster:ReduceMana(mana_to_block)
		local mana_after = self.caster:GetMana()

		return math.min(self.absorption_tooltip, self.absorption_tooltip * self.caster:GetMana() / math.max(mana_to_block, 1)) * (-1)
	end
end

------------------------------------------------------------------------------------

modifier_suna_no_yoroi_shard = modifier_suna_no_yoroi_shard or class({})

------------------------------------------------------------------------------------

function modifier_suna_no_yoroi_shard:IsPurgable() return false end

------------------------------------------------------------------------------------

function modifier_suna_no_yoroi_shard:DeclareFunctions()
	return {MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_PHYSICAL}
end

------------------------------------------------------------------------------------

function modifier_suna_no_yoroi_shard:GetAbsoluteNoDamagePhysical()
	return 1
end