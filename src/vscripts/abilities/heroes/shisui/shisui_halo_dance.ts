import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class shisui_halo_dance extends BaseAbility {

    Precache(context: CScriptPrecacheContext): void{
        //PrecacheResource("particle",  "", context);
        PrecacheResource("soundfile", "soundevents/heroes/shisui/game_sounds_shisui.vsndevts", context);
        //PrecacheResource("soundfile", "soundevents/heroes/shisui/game_sounds_vo_shisui.vsndevts", context);
    }

    /****************************************/

    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return this.GetSpecialValueFor("wave_range") + this.GetCaster().FindTalentValue("special_bonus_shisui_2");
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();

        caster.AddNewModifier(caster, this, "modifier_shisui_halo_dance", {duration: this.GetSpecialValueFor("duration")});
    }
}

@registerModifier()
export class modifier_shisui_halo_dance extends BaseModifier
{
    
}