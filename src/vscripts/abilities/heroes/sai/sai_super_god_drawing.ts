import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class sai_super_god_drawing extends BaseAbility {
    
    agyo?: CDOTA_BaseNPC;
    ungyo?: CDOTA_BaseNPC;

    /****************************************/

    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle",  "particles/units/heroes/sai/sai_super_god_drawing_spawn.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/sai/game_sounds_sai.vsndevts", context);
        //PrecacheResource("soundfile", "soundevents/heroes/sai/game_sounds_vo_sai.vsndevts", context);
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();
        let level = this.GetLevel();
        let right_pos = caster.GetAbsOrigin() + caster.GetRightVector() * 150 as Vector;
        let left_pos = caster.GetAbsOrigin() - caster.GetRightVector() * 150 as Vector;

        if (this.agyo && !this.agyo.IsNull() && this.agyo.IsAlive()) this.agyo.ForceKill(false);
        if (this.ungyo && !this.ungyo.IsNull() && this.ungyo.IsAlive()) this.ungyo.ForceKill(false);

        CreateUnitByNameAsync("npc_dota_sai_agyo" + level, right_pos, true, caster, caster, caster.GetTeamNumber(), (unit) => this.SetupUnit(unit, true));
        CreateUnitByNameAsync("npc_dota_sai_ungyo" + level, left_pos, true, caster, caster, caster.GetTeamNumber(), (unit) => this.SetupUnit(unit, false));

        
        EmitSoundOn("Hero_Sai.SuperGodDrawing.Cast", caster);
        ParticleManager.ReleaseParticleIndex(
            ParticleManager.CreateParticle("particles/neutral_fx/hellbear_rush_cast.vpcf", ParticleAttachment.ABSORIGIN, caster)
        );
    }

    SetupUnit(unit: CDOTA_BaseNPC, is_agyo: boolean) {
        let caster = this.GetCaster();
        let armor = this.GetSpecialValueFor("armor") + caster.FindTalentValue("special_bonus_sai_4");

        unit.SetPhysicalArmorBaseValue(armor);
        unit.SetControllableByPlayer(caster.GetPlayerOwnerID(), true);
        unit.SetForwardVector(caster.GetForwardVector() * 1000 as Vector);

        if (caster.HasTalent("special_bonus_sai_5")) {
            unit.AddAbility("special_bonus_sai_5").SetLevel(1);
        }

        if (is_agyo) this.agyo = unit;
        else this.ungyo = unit;

        EmitSoundOn("Hero_Sai.SuperGodDrawing.Spawn", unit);
        ParticleManager.ReleaseParticleIndex(
            ParticleManager.CreateParticle("particles/units/heroes/sai/sai_super_god_drawing_spawn.vpcf", ParticleAttachment.ABSORIGIN, unit)
        );
        
    }
}