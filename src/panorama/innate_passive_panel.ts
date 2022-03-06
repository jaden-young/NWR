var iPlayerID = Players.GetLocalPlayer();
var selectedEntities = Players.GetSelectedEntities( iPlayerID );
var mainSelected = Players.GetLocalPlayerPortraitUnit();

var passiveAbility = Entities.GetAbility(mainSelected, 3);
($("#innate_passive_ability_image") as AbilityImage).abilityname = Abilities.GetAbilityName(passiveAbility)