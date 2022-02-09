--[[ Events ]]

--------------------------------------------------------------------------------
-- GameEvent: OnItemPurchased
--------------------------------------------------------------------------------
ListenToGameEvent('dota_item_purchased', function(event)
	local hBuyer = PlayerResource:GetPlayer( event.PlayerID )
	local hBuyerHero = hBuyer:GetAssignedHero()
	hBuyerHero:ModifyGold( event.itemcost, true, 0 )
end, nil)

--------------------------------------------------------------------------------
-- GameEvent: OnNPCReplaced
--------------------------------------------------------------------------------
--[[
ListenToGameEvent('npc_replaced', function(event)
	local sNewHeroName = PlayerResource:GetSelectedHeroName( event.new_entindex )
	--print( "sNewHeroName == " .. sNewHeroName ) -- we fail to get in here
	self:BroadcastMsg( "Changed hero to " .. sNewHeroName )
end, nil)
--]]

--------------------------------------------------------------------------------
-- GameEvent: OnNPCSpawned
--------------------------------------------------------------------------------
ListenToGameEvent('npc_spawned', function(event)
	local spawnedUnit = EntIndexToHScript( event.entindex )

	if spawnedUnit:GetPlayerOwnerID() == 0 and spawnedUnit:IsRealHero() and not spawnedUnit:IsClone() then
		--print( "spawnedUnit is player's hero" )
		local hPlayerHero = spawnedUnit
		hPlayerHero:SetContextThink( "Think_InitializePlayerHero", function() return Think_InitializePlayerHero( hPlayerHero ) end, 0 )
	end

	if spawnedUnit:GetUnitName() == "npc_dota_neutral_caster" then
		--print( "Neutral Caster spawned" )
		spawnedUnit:SetContextThink( "Think_InitializeNeutralCaster", function() return Think_InitializeNeutralCaster( spawnedUnit ) end, 0 )
	end
end, nil)

ListenToGameEvent('dota_player_used_ability', function(event)
--	local player = PlayerResource:GetPlayer(event.PlayerID)
--	local abilityname = event.abilityname

	if Demo.m_bFreeSpellsEnabled == true then
		for _, hero in pairs(HeroList:GetAllHeroes()) do
			for i = 0, 24 - 1 do
				if hero:GetAbilityByIndex(i) then
					local ability = hero:GetAbilityByIndex(i)
					ability:EndCooldown()
					ability:RefundManaCost()
					ability:RefreshCharges()
				end
			end

			for i = 0, 15 do
				local item = hero:GetItemInSlot(i)

				if item then
					item:EndCooldown()
					item:RefundManaCost()
					item:RefreshCharges()
				end
			end
		end
	end
end, nil)

function Demo:RefreshPlayers()
	for _, hero in pairs(HeroList:GetAllHeroes()) do
		if not hero:IsAlive() then
			hero:RespawnHero(false, false)
		end

		for i = 0, 24 - 1 do
			local ability = hero:GetAbilityByIndex(i)
			if ability then
				if not ability:IsCooldownReady() then
					ability:EndCooldown()
				end
			end

			for i = 0, 15 do
				local item = hero:GetItemInSlot(i)

				if item then
					item:EndCooldown()
					item:RefundManaCost()
					item:RefreshCharges()
				end
			end
		end

		hero:SetHealth(hero:GetMaxHealth())
		hero:SetMana(hero:GetMaxMana())
	end
end

-- Disabled!
function Demo:OnNewHeroChosen(event)
	local old_hero = PlayerResource:GetSelectedHeroEntity(event.PlayerID)
--	local hero = PlayerResource:ReplaceHeroWith(event.PlayerID, event.hero, 99999, 0)
	local hero = CreateHeroForPlayer(event.hero, PlayerResource:GetPlayer(event.PlayerID))

	Timers:CreateTimer(1.0, function()
		old_hero:RemoveSelf()
	end)
end

function Demo:OnNewHeroSelected(event)
	PrecacheUnitByNameAsync(event.hero, function()
		local old_hero = PlayerResource:GetSelectedHeroEntity(event.PlayerID)
		local hero = PlayerResource:ReplaceHeroWith(event.PlayerID, event.hero, 99999, 0)

		Timers:CreateTimer(1.0, function()
			old_hero:RemoveSelf()
		end)
	end)
end

--------------------------------------------------------------------------------
-- Think_InitializePlayerHero
--------------------------------------------------------------------------------
function Think_InitializePlayerHero( hPlayerHero )
	if not hPlayerHero then
		return 0.1
	end

	if Demo.m_bPlayerDataCaptured == false then
--		if hPlayerHero:GetUnitName() == Demo.m_sHeroSelection then
			local nPlayerID = hPlayerHero:GetPlayerOwnerID()
			PlayerResource:ModifyGold( nPlayerID, 99999, true, 0 )
			Demo.m_bPlayerDataCaptured = true
--		end
	end

	if Demo.m_bInvulnerabilityEnabled then
		local hAllPlayerUnits = {}
		hAllPlayerUnits = hPlayerHero:GetAdditionalOwnedUnits()
		hAllPlayerUnits[ #hAllPlayerUnits + 1 ] = hPlayerHero

		for _, hUnit in pairs( hAllPlayerUnits ) do
			hUnit:AddNewModifier( hPlayerHero, nil, "modifier_invulnerable", nil )
		end
	end

	return
end

--------------------------------------------------------------------------------
-- Think_InitializeNeutralCaster
--------------------------------------------------------------------------------
function Think_InitializeNeutralCaster( neutralCaster )
	if not neutralCaster then
		return 0.1
	end

	--print( "neutralCaster:AddAbility( \"la_spawn_enemy_at_target\" )" )
	neutralCaster:AddAbility( "la_spawn_enemy_at_target" )
	return
end

--------------------------------------------------------------------------------
-- ButtonEvent: OnWelcomePanelDismissed
--------------------------------------------------------------------------------
function Demo:OnWelcomePanelDismissed( event )
	--print( "Entering Demo:OnWelcomePanelDismissed( event )" )
end

--------------------------------------------------------------------------------
-- ButtonEvent: OnRefreshButtonPressed
--------------------------------------------------------------------------------
function Demo:OnRefreshButtonPressed( eventSourceIndex )
	self:RefreshPlayers()

	self:BroadcastMsg( "#Refresh_Msg" )
end

--------------------------------------------------------------------------------
-- ButtonEvent: OnLevelUpButtonPressed
--------------------------------------------------------------------------------
function Demo:OnLevelUpButtonPressed( eventSourceIndex, data )
	local hPlayerHero = PlayerResource:GetSelectedHeroEntity(data.PlayerID)
	if hPlayerHero:GetLevel() < 30 then
		hPlayerHero:HeroLevelUp( false )
		self:BroadcastMsg( "#LevelUp_Msg" )
	end
end
--------------------------------------------------------------------------------
-- ButtonEvent: OnMaxLevelButtonPressed
--------------------------------------------------------------------------------
function Demo:OnMaxLevelButtonPressed( eventSourceIndex, data )
	local hPlayerHero = PlayerResource:GetSelectedHeroEntity( data.PlayerID )
	if hPlayerHero:GetLevel() == 30 then
		self:BroadcastMsg( "#MaxLevelAlready_Msg" )
		return
	end

	hPlayerHero:AddExperience( 1000000, false, false ) -- for some reason maxing your level this way fixes the bad interaction with OnHeroReplaced

	for i = 0, 24 - 1 do
		local hAbility = hPlayerHero:GetAbilityByIndex( i )
		if hAbility and hAbility:CanAbilityBeUpgraded () == ABILITY_CAN_BE_UPGRADED and not hAbility:IsHidden() and not hAbility:IsAttributeBonus() then
			while hAbility:GetLevel() < hAbility:GetMaxLevel() do
				hPlayerHero:UpgradeAbility( hAbility )
			end
		end
	end

	hPlayerHero:SetAbilityPoints( 8 )
	self:BroadcastMsg( "#MaxLevel_Msg" )
end

--------------------------------------------------------------------------------
-- ButtonEvent: OnFreeSpellsButtonPressed
--------------------------------------------------------------------------------
function Demo:OnFreeSpellsButtonPressed( eventSourceIndex )
	if self.m_bFreeSpellsEnabled == false then
		self.m_bFreeSpellsEnabled = true
		self:RefreshPlayers()
		self:BroadcastMsg( "#FreeSpellsOn_Msg" )
	elseif self.m_bFreeSpellsEnabled == true then
		self.m_bFreeSpellsEnabled = false
		self:BroadcastMsg( "#FreeSpellsOff_Msg" )
	end
end

--------------------------------------------------------------------------------
-- ButtonEvent: OnInvulnerabilityButtonPressed
--------------------------------------------------------------------------------
function Demo:OnInvulnerabilityButtonPressed( eventSourceIndex, data )
	local hPlayerHero = PlayerResource:GetSelectedHeroEntity( data.PlayerID )
	local hAllPlayerUnits = {}
	hAllPlayerUnits = hPlayerHero:GetAdditionalOwnedUnits()
	hAllPlayerUnits[ #hAllPlayerUnits + 1 ] = hPlayerHero

	if self.m_bInvulnerabilityEnabled == false then
		for _, hUnit in pairs( hAllPlayerUnits ) do
			hUnit:AddNewModifier( hPlayerHero, nil, "modifier_invulnerable", {} )
		end
		self.m_bInvulnerabilityEnabled = true
		self:BroadcastMsg( "#InvulnerabilityOn_Msg" )
	elseif self.m_bInvulnerabilityEnabled == true then
		for _, hUnit in pairs( hAllPlayerUnits ) do
			hUnit:RemoveModifierByName( "modifier_invulnerable" )
		end
		self.m_bInvulnerabilityEnabled = false
		self:BroadcastMsg( "#InvulnerabilityOff_Msg" )
	end
end

--------------------------------------------------------------------------------
-- ButtonEvent: OnSpawnAllyButtonPressed -- deprecated
--------------------------------------------------------------------------------
function Demo:OnSpawnAllyButtonPressed( eventSourceIndex, data )
	local hero_name = DOTAGameManager:GetHeroUnitNameByID(tonumber(data.str))
	local old_hero = PlayerResource:GetSelectedHeroEntity(data.PlayerID)
	PrecacheUnitByNameAsync(hero_name, function()
		PlayerResource:ReplaceHeroWith(data.PlayerID, hero_name, 0, 0)

		Timers:CreateTimer(1.0, function()
			if old_hero then
				UTIL_Remove(old_hero)
			end
		end)
	end)
end

function Demo:OnSpawnEnemyButtonPressed( eventSourceIndex, data )
	self.m_sHeroToSpawn	= DOTAGameManager:GetHeroUnitNameByID( tonumber( data.str ) );
end

--------------------------------------------------------------------------------
-- ButtonEvent: SpawnEnemyButtonPressed
--------------------------------------------------------------------------------
function Demo:OnSpawnEnemyButtonPressedAlt( eventSourceIndex, data )
	if self.m_sHeroToSpawn == nil then
		self:BroadcastMsg( "#EnemyNotSetup_Msg" )
		return
	end

	if #self.m_tEnemiesList >= 50 then
		self:BroadcastMsg( "#MaxEnemies_Msg" )
		return
	end

	local hPlayerHero = PlayerResource:GetSelectedHeroEntity( data.PlayerID )
	CreateUnitByNameAsync( self.m_sHeroToSpawn, hPlayerHero:GetAbsOrigin(), true, nil, nil, self.m_nENEMIES_TEAM,
		function( hEnemy )
			table.insert( self.m_tEnemiesList, hEnemy )
			hEnemy:SetControllableByPlayer( self.m_nPlayerID, false )
			hEnemy:SetRespawnPosition( hPlayerHero:GetAbsOrigin() )
			FindClearSpaceForUnit( hEnemy, hPlayerHero:GetAbsOrigin(), false )
			hEnemy:Hold()
			hEnemy:SetIdleAcquire( false )
			hEnemy:SetAcquisitionRange( 0 )
			self:BroadcastMsg( "#SpawnEnemy_Msg" )
		end )
end

--------------------------------------------------------------------------------
-- ButtonEvent: OnLevelUpEnemyButtonPressed
--------------------------------------------------------------------------------
function Demo:OnLevelUpEnemyButtonPressed( eventSourceIndex )
	for k, v in pairs( self.m_tEnemiesList ) do
		if self.m_tEnemiesList[ k ]:IsRealHero() then
			self.m_tEnemiesList[ k ]:HeroLevelUp( false )
		end
	end
	self:BroadcastMsg( "#LevelUpEnemy_Msg" )
end

--------------------------------------------------------------------------------
-- ButtonEvent: OnDummyTargetButtonPressed
--------------------------------------------------------------------------------
function Demo:OnDummyTargetButtonPressed( eventSourceIndex, data )
	local hPlayerHero = PlayerResource:GetSelectedHeroEntity( data.PlayerID )
	table.insert( self.m_tEnemiesList, CreateUnitByName( "npc_dota_hero_target_dummy", hPlayerHero:GetAbsOrigin(), true, nil, nil, self.m_nENEMIES_TEAM ) )
	local hDummy = self.m_tEnemiesList[ #self.m_tEnemiesList ]
	hDummy:SetAbilityPoints( 0 )
	hDummy:SetControllableByPlayer( self.m_nPlayerID, false )
	hDummy:Hold()
	hDummy:SetIdleAcquire( false )
	hDummy:SetAcquisitionRange( 0 )
	self:BroadcastMsg( "#SpawnDummyTarget_Msg" )
end

--------------------------------------------------------------------------------
-- ButtonEvent: OnRemoveSpawnedUnitsButtonPressed
--------------------------------------------------------------------------------
function Demo:OnRemoveSpawnedUnitsButtonPressed( eventSourceIndex )
	for k, v in pairs( self.m_tAlliesList ) do
		self.m_tAlliesList[ k ]:Destroy()
		self.m_tAlliesList[ k ] = nil
	end
	for k, v in pairs( self.m_tEnemiesList ) do
		self.m_tEnemiesList[ k ]:Destroy()
		self.m_tEnemiesList[ k ] = nil
	end

	self.m_nEnemiesCount = 0

	self:BroadcastMsg( "#RemoveSpawnedUnits_Msg" )
end

--------------------------------------------------------------------------------
-- ButtonEvent: OnLaneCreepsButtonPressed
--------------------------------------------------------------------------------
function Demo:OnLaneCreepsButtonPressed( eventSourceIndex )
	SendToServerConsole( "toggle dota_creeps_no_spawning" )
	if self.m_bCreepsEnabled == false then
		self.m_bCreepsEnabled = true
		self:BroadcastMsg( "#LaneCreepsOn_Msg" )
	elseif self.m_bCreepsEnabled == true then
		-- if we're disabling creep spawns, then also kill existing creep waves
		SendToServerConsole( "dota_kill_creeps radiant" )
		SendToServerConsole( "dota_kill_creeps dire" )
		self.m_bCreepsEnabled = false
		self:BroadcastMsg( "#LaneCreepsOff_Msg" )
	end
end

--------------------------------------------------------------------------------
-- GameEvent: OnChangeCosmeticsButtonPressed
--------------------------------------------------------------------------------
function Demo:OnChangeCosmeticsButtonPressed( eventSourceIndex )
	-- currently running the command directly in XML, should run it here if possible
	-- can use GetSelectedHeroID
end

--------------------------------------------------------------------------------
-- GameEvent: OnChangeHeroButtonPressed
--------------------------------------------------------------------------------
function Demo:OnChangeHeroButtonPressed( eventSourceIndex, data )
	GameRules:ResetToHeroSelection()
end

--------------------------------------------------------------------------------
-- GameEvent: OnPauseButtonPressed
--------------------------------------------------------------------------------
function Demo:OnPauseButtonPressed( eventSourceIndex )
	PauseGame(not GameRules:IsGamePaused())
end

--------------------------------------------------------------------------------
-- GameEvent: OnLeaveButtonPressed
--------------------------------------------------------------------------------
function Demo:OnLeaveButtonPressed( eventSourceIndex )
	GAME_WINNER_TEAM = 0
	GameRules:SetGameWinner(GAME_WINNER_TEAM)
	GameRules:SetSafeToLeave(true)
end
