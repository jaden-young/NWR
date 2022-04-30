LinkLuaModifier("modifier_temari_fusajin_no_jutsu_shard", "abilities/heroes/temari/fusajin_no_jutsu", LUA_MODIFIER_MOTION_NONE)

temari_fusajin_no_jutsu = class({})

function temari_fusajin_no_jutsu:Precache( context )
    PrecacheResource( "particle",  "particles/units/heroes/temari/temari_wind_dust.vpcf", context )
end

function temari_fusajin_no_jutsu:ProcsMagicStick()
    return true
end

function temari_fusajin_no_jutsu:GetAOERadius()
	return self:GetSpecialValueFor("radius")
end

function temari_fusajin_no_jutsu:OnSpellStart()
	local caster = self:GetCaster()
	local projectile_data = {
		EffectName = "particles/units/heroes/temari/temari_wind_dust.vpcf",
		Ability = self,
		iMoveSpeed = self:GetSpecialValueFor("magic_missile_speed"),
		Source = caster,
		Target = self:GetCursorTarget(),
		bDodgeable = false,
		iSourceAttachment = "attach_right_hand",
		bProvidesVision = false,
		iVisionTeamNumber = caster:GetTeamNumber(),
		iVisionRadius = 0,
	}

	ProjectileManager:CreateTrackingProjectile(projectile_data)

	local cd_reduction = self:GetSpecialValueFor("cooldown_reduction_other_abilities")
	local kamaitachi_ability = caster:FindAbilityByName("temari_kamaitachi_no_jutsu")
	if kamaitachi_ability:IsTrained() and not kamaitachi_ability:IsCooldownReady() then
		local left = kamaitachi_ability:GetCooldownTimeRemaining()
		kamaitachi_ability:EndCooldown()
		kamaitachi_ability:StartCooldown(left - cd_reduction)
	end


	local kiri_ability = caster:FindAbilityByName("temari_kuchiyose_kirikiri_mai")
	if kiri_ability:IsTrained() and not kiri_ability:IsCooldownReady() then
		local left = kiri_ability:GetCooldownTimeRemaining()
		kiri_ability:EndCooldown()
		kiri_ability:StartCooldown(left - cd_reduction)
	end

	if caster:HasShard() then
		self:ProcShard()
	end
end

function temari_fusajin_no_jutsu:ProcShard()
	local caster = self:GetCaster()
	local attacks = self:GetSpecialValueFor("shard_attacks")
	local modifier = caster:AddNewModifier(caster, self, "modifier_temari_fusajin_no_jutsu_shard", {duration = 1})

	local enemies = FindUnitsInRadius(
		caster:GetTeamNumber(), 
		caster:GetAbsOrigin(),
		nil,
		self:GetSpecialValueFor("shard_range"), 
		DOTA_UNIT_TARGET_TEAM_ENEMY, 
		DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_CREEP, 
		DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAG_NO_INVIS, 
		0, 
		false
	)

	for _, enemy in pairs(enemies) do
		modifier.active = true
		caster:PerformAttack(enemy, false, true, true, false, true, false, false)
		modifier.active = true

		attacks = attacks - 1

		if attacks < 1 then
			modifier:Destroy()
			break
		end
	end
end

function temari_fusajin_no_jutsu:OnProjectileHit(target, location)
	local caster = self:GetCaster()
	local radius = self:GetSpecialValueFor("radius")
	local damage_table = {
		-- victim = target,
		attacker = caster,
		damage = self:GetSpecialValueFor("damage"),
		damage_type = self:GetAbilityDamageType(),
		damage_flags = DOTA_DAMAGE_FLAG_NONE,
		ability = self
	}

	local units = FindUnitsInRadius(
		caster:GetTeamNumber(), 
		location,
		nil,
		radius, 
		DOTA_UNIT_TARGET_TEAM_ENEMY, 
		DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_CREEP, 
		DOTA_UNIT_TARGET_FLAG_NONE, 
		0, 
		false
	)

	for _,unit in pairs(units) do

		if unit:IsMagicImmune() == false then
			damage_table.victim = unit
			ApplyDamage(damage_table)
		end
	end
end

function temari_fusajin_no_jutsu:GetCooldown()
	if self:GetCaster():FindAbilityByName("special_bonus_temari_2"):GetLevel() > 0 then
		return 3
	else
		return 5
	end
end

----------------------------------------------------------------------------------------

if modifier_temari_fusajin_no_jutsu_shard == nil then modifier_temari_fusajin_no_jutsu_shard = class({}) end

----------------------------------------------------------------------------------------

function modifier_temari_fusajin_no_jutsu_shard:IsHidden()		return true end
function modifier_temari_fusajin_no_jutsu_shard:IsPurgable()	return false end

function modifier_temari_fusajin_no_jutsu_shard:OnCreated(kv)
	self.reduction = -(100 - self:GetAbility():GetSpecialValueFor("shard_damage_pct"))
	self.active = false
end

function modifier_temari_fusajin_no_jutsu_shard:DeclareFunctions()
	return {MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE}
end

function modifier_temari_fusajin_no_jutsu_shard:GetModifierDamageOutgoing_Percentage()
	if IsServer() then
		if self.active then
			return self.reduction
		else
			return 0
		end
	end
end