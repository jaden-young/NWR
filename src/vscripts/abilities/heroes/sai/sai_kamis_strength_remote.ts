import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

interface SuperGodDrawingAbility
{
    agyo?: CDOTA_BaseNPC;
    ungyo?: CDOTA_BaseNPC;
}

@registerAbility()
export class sai_kamis_strength_remote extends BaseAbility {

    Precache(context: CScriptPrecacheContext): void{
        //PrecacheResource("particle",  "", context);
        PrecacheResource("soundfile", "soundevents/heroes/sai/game_sounds_sai.vsndevts", context);
        //PrecacheResource("soundfile", "soundevents/heroes/sai/game_sounds_vo_sai.vsndevts", context);
    }

    /****************************************/

    Spawn(): void {
        if (!IsServer()) return;
        this.SetLevel(1);
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();
        let drawing_ability = caster.FindAbilityByName("sai_super_god_drawing") as SuperGodDrawingAbility;

        if (!drawing_ability) return;
        
        this.CastKamisStrength(drawing_ability.agyo);
        this.CastKamisStrength(drawing_ability.ungyo);
    }

    CastKamisStrength(unit: CDOTA_BaseNPC | undefined): void {
        if (!unit || unit.IsNull() || !unit.IsAlive()) return;

        let ability = unit.FindAbilityByName("sai_kamis_strength");

        if (ability && ability.IsCooldownReady() && !unit.IsSilenced()) {
            ability.OnSpellStart();
            ability.UseResources(true, false, true);
        }
    }
}