import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

interface SuperGodDrawingAbility extends CDOTABaseAbility
{
    agyo?: CDOTA_BaseNPC;
    ungyo?: CDOTA_BaseNPC;
}

@registerAbility()
export class sai_super_god_drawing extends BaseAbility {
    
    agyo?: CDOTA_BaseNPC;
    ungyo?: CDOTA_BaseNPC;

    /****************************************/

    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle",  "particles/units/heroes/sai/sai_super_god_drawing_spawn.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/sai/game_sounds_sai.vsndevts", context);
        PrecacheResource("soundfile", "soundevents/heroes/sai/game_sounds_vo_sai.vsndevts", context);
    }

    /****************************************/

    GetIntrinsicModifierName(): string {
        return "modifier_sai_super_god_drawing";
    }

    /****************************************/

        OnAbilityPhaseStart(): boolean {
            EmitSoundOn("Hero_Sai.SuperGodDrawing.PreCast", this.GetCaster());
            EmitSoundOn("VO_Hero_Sai.SuperGodDrawing.Cast", this.GetCaster());
            return true
        }
    
    /****************************************/    

    OnSpellStart(): void {
        let caster = this.GetCaster();
        let level = this.GetLevel();
        let remote_ability = caster.FindAbilityByName("sai_kamis_strength_remote");
        let right_pos = caster.GetAbsOrigin() + caster.GetRightVector() * 150 as Vector;
        let left_pos = caster.GetAbsOrigin() - caster.GetRightVector() * 150 as Vector;

        if (this.agyo && !this.agyo.IsNull() && this.agyo.IsAlive()) this.agyo.ForceKill(false);
        if (this.ungyo && !this.ungyo.IsNull() && this.ungyo.IsAlive()) this.ungyo.ForceKill(false);

        CreateUnitByNameAsync("npc_dota_sai_agyo" + level, right_pos, true, caster, caster, caster.GetTeamNumber(), (unit) => this.SetupUnit(unit, true));
        CreateUnitByNameAsync("npc_dota_sai_ungyo" + level, left_pos, true, caster, caster, caster.GetTeamNumber(), (unit) => this.SetupUnit(unit, false));

        if (remote_ability) Timers.CreateTimer(0.2, () => remote_ability!.SetActivated(true));


        
        EmitSoundOn("Hero_Sai.SuperGodDrawing.Cast", caster);
    }

    /****************************************/

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

        ParticleManager.ReleaseParticleIndex(
            ParticleManager.CreateParticle("particles/units/heroes/sai/sai_super_god_drawing_spawn.vpcf", ParticleAttachment.ABSORIGIN, unit)
        );
        
    }
}

@registerModifier()
export class modifier_sai_super_god_drawing extends BaseModifier
{
    IsHidden(): boolean         {return true}
    IsPurgable(): boolean       {return false}
    RemoveOnDeath(): boolean    {return false}

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.ON_DEATH,
    ]}

    /****************************************/

    OnDeath(event: ModifierInstanceEvent): void {
        if (!IsServer()) return;
        let ability = this.GetAbility() as SuperGodDrawingAbility;
        let remote_ability = this.GetParent().FindAbilityByName("sai_kamis_strength_remote");

        if (!remote_ability || !ability?.IsTrained()) return;
        
        let agyo = ability.agyo!;
        let ungyo = ability.ungyo!;

        if ((!agyo || agyo.IsNull() || !agyo.IsAlive()) && (!ungyo || ungyo.IsNull() || !ungyo.IsAlive())) {
            if (remote_ability.IsActivated()) remote_ability.SetActivated(false);
        }
    }
}