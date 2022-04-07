import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

interface kv {
	ability_id: EntityIndex;
}

@registerAbility()
export class kakashi_sharingan extends BaseAbility
{
    Precache(context: CScriptPrecacheContext): void{
        //PrecacheResource("particle", "particles/units/heroes/kakashi/chidori.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/kakashi/game_sounds_kakashi.vsndevts", context);
        PrecacheResource("soundfile", "soundevents/heroes/kakashi/game_sounds_vo_kakashi.vsndevts", context);
    }

    /****************************************/

    Spawn(): void {
        if (this.GetCaster().IsRealHero()) {
            ListenToGameEvent("dota_player_used_ability", (event) => this.OnAbilityUsed(event), undefined);
        }
    }

    /****************************************/

    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        let caster = this.GetCaster();
        let result = UnitFilter(
            target,
            UnitTargetTeam.ENEMY,
            UnitTargetType.HERO,
            UnitTargetFlags.NOT_CREEP_HERO + UnitTargetFlags.NOT_ILLUSIONS,
            caster.GetTeamNumber()
        )

        if (result != UnitFilterResult.SUCCESS) return result;

        const tracker = CustomNetTables.GetTableValue("kakashi_sharingan_tracker", target.GetPlayerOwnerID().toString());

        return tracker && UnitFilterResult.SUCCESS || UnitFilterResult.FAIL_CUSTOM;
    }

    /****************************************/

    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        return "#dota_hud_error_cant_steal_spell"
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();
        let target = this.GetCursorTarget() as CDOTA_BaseNPC;
        let duration = this.GetSpecialValueFor("spell_duration") + caster.FindTalentValue("special_bonus_kakashi_5");

        if (target?.TriggerSpellAbsorb(this)) return;


        const tracker = CustomNetTables.GetTableValue("kakashi_sharingan_tracker", target.GetPlayerOwnerID().toString());
        let ability_name = tracker && tracker.last_ability || "invalid"
        let original_ability = target.FindAbilityByName(ability_name);

        if (!original_ability) return;

        let ability_id = this.StealAbility(original_ability, ability_name as string);

        caster.AddNewModifier(caster, this, "modifier_kakashi_sharingan", {duration: duration, ability_id: ability_id})

        EmitSoundOn("Hero_Kakashi.Sharingan.Cast", caster);
    }

    /****************************************/

    StealAbility(ability: CDOTABaseAbility, ability_name: string): EntityIndex {
        let caster = this.GetCaster();

        if (caster.HasModifier("modifier_kakashi_sharingan")) {
            caster.RemoveModifierByName("modifier_kakashi_sharingan");
        }

        let stolen_ability = caster.AddAbility(ability_name);
        stolen_ability.SetHidden(true);
        stolen_ability.SetLevel(this.GetLevel());
        stolen_ability.SetStolen(true);

        caster.SwapAbilities("kakashi_empty", ability_name, false, true)

        return stolen_ability.entindex();
    }

    /****************************************/

    OnAbilityUsed(event: DotaPlayerUsedAbilityEvent): void {
        if (!event.caster_entindex || !event.abilityname || !event.PlayerID) return;
        let caster = EntIndexToHScript(event.caster_entindex) as CDOTA_BaseNPC;
        let ability = caster.FindAbilityByName(event.abilityname);
        
        if (!ability || !ability.IsStealable() || ability.GetAbilityType() == AbilityTypes.ULTIMATE) return;

        CustomNetTables.SetTableValue("kakashi_sharingan_tracker", tostring(event.PlayerID), {last_ability: event.abilityname});
    }
}



@registerModifier()
export class modifier_kakashi_sharingan extends BaseModifier
{
    ability_id?: EntityIndex;

    /****************************************/

    OnCreated(params: kv): void {
        if (!IsServer()) return;

        this.ability_id = params.ability_id;
    }

    /****************************************/

    OnDestroy(): void {
        if (!IsServer()) return;
        let parent = this.GetParent();
        let ability = EntIndexToHScript(this.ability_id!) as CDOTABaseAbility

        parent.SwapAbilities(ability.GetAbilityName(), "kakashi_empty", false, true)
        
        parent.RemoveAbilityByHandle(ability);
    }
}