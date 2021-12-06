--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["5"] = 11,["6"] = 12,["7"] = 13,["9"] = 14,["10"] = 14,["11"] = 15,["12"] = 16,["13"] = 17,["15"] = 14,["18"] = 20,["19"] = 12,["20"] = 22,["21"] = 23,["22"] = 24,["23"] = 22,["24"] = 26,["25"] = 27,["26"] = 28,["27"] = 26,["28"] = 31,["29"] = 32,["30"] = 33,["31"] = 31});
local ____exports = {}
if IsServer() then
    CDOTA_BaseNPC.GetAllAbilities = function(self)
        local abilities = {}
        do
            local i = 0
            while i < DOTA_MAX_ABILITIES do
                local ability = self:GetAbilityByIndex(i)
                if ability then
                    __TS__ArrayPush(abilities, ability)
                end
                i = i + 1
            end
        end
        return abilities
    end
    CDOTA_BaseNPC.HasTalent = function(self, talentName)
        local talent = self:FindAbilityByName(talentName)
        return ((talent and (function() return talent:GetLevel() > 0 end)) or (function() return false end))()
    end
    CDOTA_BaseNPC.GetTalent = function(self, talentName)
        local talent = self:FindAbilityByName(talentName)
        return (talent and talent:GetSpecialValueFor("value")) or 0
    end
    CDOTA_BaseNPC.FindTalentValue = function(self, talentName, key)
        local talent = self:FindAbilityByName(talentName)
        return (talent and talent:GetSpecialValueFor((key and key) or "value")) or 0
    end
end
return ____exports
