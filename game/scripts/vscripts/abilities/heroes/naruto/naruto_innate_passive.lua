LinkLuaModifier("modifier_naruto_innate_passive", 	"abilities/heroes/naruto/naruto_innate_passive", LUA_MODIFIER_MOTION_NONE)
--------------------------------------------------------------------------------

naruto_innate_passive = naruto_innate_passive or class({})

--------------------------------------------------------------------------------

function naruto_innate_passive:Spawn()
    if not IsServer() then return end
    self:SetLevel(1)
end

--------------------------------------------------------------------------------

function naruto_innate_passive:GetIntrinsicModifierName()
    return "modifier_naruto_innate_passive"
end

--------------------------------------------------------------------------------

function naruto_innate_passive:OnHeroLevelUp()
    self:GetCaster():FindModifierByName("modifier_naruto_innate_passive"):UpdateValues()
end

--------------------------------------------------------------------------------

modifier_naruto_innate_passive = modifier_naruto_innate_passive or class({})

--------------------------------------------------------------------------------

function modifier_naruto_innate_passive:IsPurgable()    return false end
function modifier_naruto_innate_passive:RemoveOnDeath() return false end

--------------------------------------------------------------------------------

function modifier_naruto_innate_passive:OnCreated(kv)
    local ability = self:GetAbility()

    self.health_regen = ability:GetSpecialValueFor("health_regen")
    self.mana_regen = ability:GetSpecialValueFor("mana_regen")
    self.hp_regen_lvl = ability:GetSpecialValueFor("hp_regen_lvl")
    self.mp_regen_lvl = ability:GetSpecialValueFor("mp_regen_lvl")
    self.ultimate_mulitplier = ability:GetSpecialValueFor("ultimate_mulitplier") / 100

    --

    self.active_hp_regen = self.health_regen
    self.active_mana_regen = self.mana_regen
    
    self:SetHasCustomTransmitterData(true)
end

--------------------------------------------------------------------------------

function modifier_naruto_innate_passive:AddCustomTransmitterData( )
	return {
		active_hp_regen = self.active_hp_regen,
        active_mana_regen = self.active_mana_regen,
	}
end

--------------------------------------------------------------------------------

function modifier_naruto_innate_passive:HandleCustomTransmitterData(data)
	self.active_hp_regen = data.active_hp_regen
    self.active_mana_regen = data.active_mana_regen
end

--------------------------------------------------------------------------------

function modifier_naruto_innate_passive:UpdateValues()
    local level = self:GetParent():GetLevel() - 1
    self.active_hp_regen = self.health_regen + self.hp_regen_lvl * level
    self.active_mana_regen = self.mana_regen + self.mp_regen_lvl * level

    self:SendBuffRefreshToClients()
end

--------------------------------------------------------------------------------

function modifier_naruto_innate_passive:DeclareFunctions()
    return {
        MODIFIER_PROPERTY_HEALTH_REGEN_CONSTANT,
        MODIFIER_PROPERTY_MANA_REGEN_CONSTANT
    }
end

--------------------------------------------------------------------------------

function modifier_naruto_innate_passive:GetModifierConstantHealthRegen()
    return self.active_hp_regen * (self:GetParent():HasModifier("modifier_kyuubi_chakra_mode_active") and self.ultimate_mulitplier or 1)
end

--------------------------------------------------------------------------------

function modifier_naruto_innate_passive:GetModifierConstantManaRegen()
    return self.active_mana_regen * (self:GetParent():HasModifier("modifier_kyuubi_chakra_mode_active") and self.ultimate_mulitplier or 1)
end