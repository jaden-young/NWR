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
        this.SetActivated(false);
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();
        let drawing_ability = caster.FindAbilityByName("sai_super_god_drawing") as SuperGodDrawingAbility;

        if (!drawing_ability) return;

        let cd1 = this.CastKamisStrength(drawing_ability.agyo);
        let cd2 = this.CastKamisStrength(drawing_ability.ungyo);

        if (cd1 != -1 || cd2 != -1) {
            this.EndCooldown()
            this.StartCooldown(cd1 > cd2 ? cd2 : cd1);
        }
    }

    CastKamisStrength(unit: CDOTA_BaseNPC | undefined): number {
        if (!unit || unit.IsNull() || !unit.IsAlive()) return -1;

        let ability = unit.FindAbilityByName("sai_kamis_strength");

        if (ability && !unit.IsSilenced()) {
            if (ability.IsCooldownReady()) {
                ability.OnSpellStart();
                ability.UseResources(true, false, true);
                return ability.GetCooldownTimeRemaining();
            } else {
                return ability.GetCooldownTimeRemaining();
            }
        }

        return -1
    }
}