import {BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"
import {BaseVectorAbility} from "../../../lib/vector_targeting_interface";

@registerAbility()
export class kakashi_earth_release extends BaseVectorAbility
{
    Precache(context: CScriptPrecacheContext): void{
        //PrecacheResource("particle", "", context);
        PrecacheResource("soundfile", "soundevents/heroes/kakashi/game_sounds_kakashi.vsndevts", context);
        PrecacheResource("soundfile", "soundevents/heroes/kakashi/game_sounds_vo_kakashi.vsndevts", context);
    }

    /****************************************/

    GetVectorTargetRange(): number {
        return this.GetSpecialValueFor("wall_length")
    }

    /****************************************/

    GetVectorTargetStartRadius(): number {
        return this.GetSpecialValueFor("wall_width")
    }

    /****************************************/

    IsDualVectorDirection(): boolean {
        return true;
    }

    /****************************************/

    OnVectorCastStart(start_loc: Vector, direction: Vector): void {
        let caster = this.GetCaster();
        let damage = this.GetSpecialValueFor("damage");
        let duration = this.GetSpecialValueFor("duration");
        let stun_duration = this.GetSpecialValueFor("stun_duration");
        let radius = this.GetSpecialValueFor("radius");
        let length = this.GetSpecialValueFor("wall_length") / 2;
        let width = this.GetSpecialValueFor("wall_width");
        let start_pos = start_loc + length * direction as Vector;
        let end_pos = start_loc - length * direction as Vector;

        for (let i = -(length / width); i <= length / width; i++) {
            let position = start_loc + i * width * direction as Vector;
            let block = CreateModifierThinker(caster, this, "modifier_kakashi_earth_release_thinker", {duration: duration}, position, caster.GetTeamNumber(), true);
            block.SetHullRadius(width);
        }

        EmitSoundOnLocationWithCaster(start_loc, "Hero_Kakashi.MudWall.Cast", caster)
        EmitSoundOnLocationWithCaster(start_loc, "Hero_Kakashi.MudWall.Layer", caster)
        let wall_fx = ParticleManager.CreateParticle("particles/units/heroes/kakashi/mud_wall.vpcf", ParticleAttachment.WORLDORIGIN, undefined);
        ParticleManager.SetParticleControl(wall_fx, 0, start_pos)
        ParticleManager.SetParticleControl(wall_fx, 1, end_pos)
        ParticleManager.SetParticleControl(wall_fx, 2, Vector(duration, 0, 0))
        ParticleManager.ReleaseParticleIndex(wall_fx)

        let units = FindUnitsInLine(
            caster.GetTeamNumber(),
            start_pos,
            end_pos,
            undefined,
            radius,
            UnitTargetTeam.BOTH,
            UnitTargetType.BASIC + UnitTargetType.HERO,
            0
        )

        let damage_table: ApplyDamageOptions = {
            attacker: caster,
            victim: caster,
            damage: damage,
            damage_type: this.GetAbilityDamageType(),
            ability: this
        }

        Timers.CreateTimer(FrameTime(), () =>{
            units.forEach(unit => {
                FindClearSpaceForUnit(unit, unit.GetAbsOrigin(), true);

                if (unit.GetTeamNumber() != caster.GetTeamNumber()) {
                    damage_table.victim = unit;
                    ApplyDamage(damage_table);

                    unit.AddNewModifier(caster, this, "modifier_stunned", {duration: stun_duration * (1 - unit.GetStatusResistance())});
                }
            });
        });
    }
}



@registerModifier()
export class modifier_kakashi_earth_release_thinker extends BaseModifier
{
   IsPurgable(): boolean {return false}

   /****************************************/

   OnDestroy(): void {
       if (!IsServer()) return;
       EmitSoundOnLocationWithCaster(this.GetParent().GetAbsOrigin(), "Hero_EarthShaker.FissureDestroy", this.GetCaster()!)
       UTIL_Remove(this.GetParent());
   }
}