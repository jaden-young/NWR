LinkLuaModifier("modifier_kyuubi_chakra_mode_active", 	"abilities/heroes/naruto/kyuubi_chakra_mode.lua", LUA_MODIFIER_MOTION_NONE)
--------------------------------------------------------------------------------

naruto_kyuubi_chakra_mode = naruto_kyuubi_chakra_mode or class({})

--------------------------------------------------------------------------------

function naruto_kyuubi_chakra_mode:Precache( context )
	PrecacheResource( "soundfile", "soundevents/heroes/naruto/kcm_cast_talking.vsndevts", context )
	PrecacheResource( "soundfile", "soundevents/heroes/naruto/kcm_cast.vsndevts", context )
end

--------------------------------------------------------------------------------

function naruto_kyuubi_chakra_mode:OnSpellStart()
	local caster = self:GetCaster()
	local duration = self:GetSpecialValueFor("duration")

	caster:AddNewModifier(caster, self, "modifier_kyuubi_chakra_mode_active", {duration = self:GetSpecialValueFor("duration")})

	EmitSoundOn("kcm_cast_talking", caster)
	EmitSoundOn("kcm_cast", caster)

	self:CheckClones()
end

--------------------------------------------------------------------------------

function naruto_kyuubi_chakra_mode:CheckClones()
	local caster = self:GetCaster()
	local player = caster:GetPlayerOwner()

	local allies = FindUnitsInRadius(
		caster:GetTeamNumber(), 
		caster:GetAbsOrigin(), 
		nil, 
		-1, 
		DOTA_UNIT_TARGET_TEAM_FRIENDLY, 
		DOTA_UNIT_TARGET_HERO, 
		DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, 
		0, 
		false
	)

	for _, ally in pairs(allies) do
		if ally:IsIllusion() and ally:GetPlayerOwner() == player then
			self:ActivateChakraMode(ally)
		end
	end
end

--------------------------------------------------------------------------------

function naruto_kyuubi_chakra_mode:ActivateChakraMode(unit)
	local caster = self:GetCaster()
	local instance = caster:FindModifierByName("modifier_kyuubi_chakra_mode_active")
	local duration = instance and instance:GetRemainingTime() or 0.5

	unit:AddNewModifier(caster, self, "modifier_kyuubi_chakra_mode_active", {duration = duration})
	EmitSoundOn("kcm_cast", unit)
end

--------------------------------------------------------------------------------

modifier_kyuubi_chakra_mode_active = modifier_kyuubi_chakra_mode_active or class({})

--------------------------------------------------------------------------------

function modifier_kyuubi_chakra_mode_active:OnCreated()
	local ability = self:GetAbility()
	local caster = self:GetCaster()
	
	self.move_speed = ability:GetSpecialValueFor("bonus_ms")
	self.base_attack_time = ability:GetSpecialValueFor("base_attack_time")

	if not IsServer() then return end
	
	local rasenshuriken = caster:FindAbilityByName("naruto_rasenshuriken")
	local tailed_beast_bomb = caster:FindAbilityByName("naruto_tailed_beast_bomb")


	if ability:GetLevel() > 1 and rasenshuriken then
		rasenshuriken:SetHidden(false)
	end

	if ability:GetLevel() > 2 and tailed_beast_bomb then
		tailed_beast_bomb:StartCooldown(ability:GetSpecialValueFor("tailed_beast_bomb_cd"))
		tailed_beast_bomb:SetHidden(false)
	end
end

--------------------------------------------------------------------------------

function modifier_kyuubi_chakra_mode_active:OnRemoved()
	if not IsServer() then return end

	local caster = self:GetCaster()
	local rasenshuriken = caster:FindAbilityByName("naruto_rasenshuriken")
	local tailed_beast_bomb = caster:FindAbilityByName("naruto_tailed_beast_bomb")

	if rasenshuriken then
		rasenshuriken:SetHidden(true)
	end
	
	if tailed_beast_bomb then
		tailed_beast_bomb:SetHidden(true)
	end

end

--------------------------------------------------------------------------------

function modifier_kyuubi_chakra_mode_active:DeclareFunctions() 
	return {
		MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
		MODIFIER_PROPERTY_BASE_ATTACK_TIME_CONSTANT,
		MODIFIER_PROPERTY_MODEL_CHANGE
	}
end

--------------------------------------------------------------------------------

function modifier_kyuubi_chakra_mode_active:GetModifierMoveSpeedBonus_Constant()
	return self.move_speed
end

--------------------------------------------------------------------------------

function modifier_kyuubi_chakra_mode_active:GetModifierBaseAttackTimeConstant()
	return self.base_attack_time
end

--------------------------------------------------------------------------------

function modifier_kyuubi_chakra_mode_active:GetModifierModelChange()
	return "models/sexy_naruto/sexy_naruto_kcm_base.vmdl"
end