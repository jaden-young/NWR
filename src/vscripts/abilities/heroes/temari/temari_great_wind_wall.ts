import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class temari_great_wind_wall extends BaseAbility {

    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle",  "particles/units/heroes/temari/temari_great_wind_wlal.vpcf", context);
        PrecacheResource("particle",  "particles/units/heroes/temari/temari_great_wind_layer.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/temari/game_sounds_temari.vsndevts", context);
        //PrecacheResource("soundfile", "soundevents/heroes/temari/game_sounds_vo_temari.vsndevts", context);
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();
        let position = this.GetCursorPosition();
        let radius = this.GetSpecialValueFor("radius");
        let desired_angle = this.GetSpecialValueFor("angle") / 2;
        let slow_duration = this.GetSpecialValueFor("slow_duration");
        let knockback_distance = this.GetSpecialValueFor("knockback_distance");

        let origin = caster.GetAbsOrigin();
        let direction = (position - origin as Vector).Normalized();
        let angle = VectorToAngles(direction).y;

        let kv = {
			center_x: origin.x,
			center_y: origin.y,
			center_z: origin.z,
			should_stun: false, 
			duration: this.GetSpecialValueFor("knockback_duration"),
			knockback_duration: this.GetSpecialValueFor("knockback_duration"),
			knockback_distance: knockback_distance,
			knockback_height: 0,
        }

        let damage_table: ApplyDamageOptions = {
            attacker: caster,
            victim: caster,
            damage: this.GetSpecialValueFor("damage"),
            damage_type: this.GetAbilityDamageType(),
            ability: this
        }

        let enemies = FindUnitsInRadius(
            caster.GetTeamNumber(),
            origin,
            undefined,
            radius,
            this.GetAbilityTargetTeam(),
            this.GetAbilityTargetType(),
            this.GetAbilityTargetFlags(),
            FindOrder.ANY,
            false
        );

        enemies.forEach(enemy => {
            let relative_direction = (enemy.GetAbsOrigin() - origin as Vector).Normalized();
            let relative_angle = VectorAngles(relative_direction).y;
            let difference = math.abs(AngleDiff(angle, relative_angle));

            if (difference <= desired_angle) {
                enemy.RemoveModifierByName("modifier_knockback");
                enemy.AddNewModifier(caster, this, "modifier_knockback", kv);
                enemy.AddNewModifier(caster, this, "modifier_temari_great_wind_wall", {duration: slow_duration * (1 - enemy.GetStatusResistance())});

                damage_table.victim = enemy;
                ApplyDamage(damage_table);
            }
        });

        EmitSoundOn("Hero_Temari.GreatWindWall.Cast", caster);
        let effect_cast = ParticleManager.CreateParticle("particles/units/heroes/temari/temari_great_wind_wlal.vpcf", ParticleAttachment.CUSTOMORIGIN, caster)
        ParticleManager.SetParticleControl(effect_cast, 0, origin)
        ParticleManager.SetParticleControlForward(effect_cast, 0, direction)
        ParticleManager.ReleaseParticleIndex(effect_cast)

        ParticleManager.ReleaseParticleIndex(
            ParticleManager.CreateParticle("particles/econ/items/windrunner/windranger_arcana/windranger_arcana_ambient_v2_ground_arcs_flat.vpcf", ParticleAttachment.ABSORIGIN, caster)
        )

        let dust_fx = ParticleManager.CreateParticle("particles/units/heroes/temari/temari_great_wind_layer.vpcf", ParticleAttachment.ABSORIGIN, caster);
        ParticleManager.SetParticleControl(dust_fx, 1, origin)
        ParticleManager.SetParticleControlForward(dust_fx, 1, -direction as Vector)
        ParticleManager.SetParticleControlForward(dust_fx, 3, -direction as Vector)
        ParticleManager.ReleaseParticleIndex(dust_fx);
    }
}

@registerModifier()
export class modifier_temari_great_wind_wall extends BaseModifier
{
    move_slow?: number;

    /****************************************/

    IsPurgable(): boolean       {return true}

    /****************************************/

    OnCreated(params: Object): void {
        this.move_slow = -this.GetAbility()!.GetSpecialValueFor("move_slow");
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.MOVESPEED_BONUS_PERCENTAGE
    ]}

    /****************************************/
    
    GetModifierMoveSpeedBonus_Percentage(): number {
        return this.move_slow!;
    }

    /****************************************/

    GetEffectName(): string {
        return "particles/units/heroes/temari/temari_great_wind_wall_buff.vpcf";
    }

    /****************************************/
    
    GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.ABSORIGIN;
    }
}