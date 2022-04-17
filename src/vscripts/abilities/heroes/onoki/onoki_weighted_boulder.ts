import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

interface extra
{
    fx_id?: ParticleID;
}

@registerAbility()
export class onoki_weighted_boulder extends BaseAbility {

    rock_fx?: ParticleID;

    /****************************************/

    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle",  "particles/units/heroes/onoki/onoki_weighted_boulder_technique.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/onoki/game_sounds_onoki.vsndevts", context);
        //PrecacheResource("soundfile", "soundevents/heroes/onoki/game_sounds_vo_onoki.vsndevts", context);
    }

    /****************************************/

    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }

    /****************************************/

    OnAbilityPhaseStart(): boolean {
        let caster = this.GetCaster();
        let position = this.GetCursorPosition();
        let direction = position - caster.GetAbsOrigin() as Vector;
        direction.z = 0;
        direction = direction.Normalized();

        this.rock_fx = ParticleManager.CreateParticle("particles/units/heroes/onoki/onoki_weighted_boulder_technique.vpcf", ParticleAttachment.ABSORIGIN, caster);
        ParticleManager.SetParticleControl(this.rock_fx, 0, caster.GetAttachmentOrigin(caster.ScriptLookupAttachment("attach_hitloc")) + direction * 125 as Vector);

        EmitSoundOn("Hero_Onoki.WeightedBoulder.Precast", caster);
        return true;
    }

    /****************************************/

    OnAbilityPhaseInterrupted(): void {
        ParticleManager.DestroyParticle(this.rock_fx!, true);
        ParticleManager.ReleaseParticleIndex(this.rock_fx!);
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();
        let position = this.GetCursorPosition();
        let origin = caster.GetAbsOrigin();
        let speed = this.GetSpecialValueFor("speed");
        let min_distance = this.GetSpecialValueFor("min_range");
        let distance = (position - caster.GetAbsOrigin() as Vector).Length2D();
        let fx_id = this.rock_fx;

        let direction = position - caster.GetAbsOrigin() as Vector;
        direction.z = 0;
        direction = direction.Normalized();

        position = distance >= min_distance ? position : direction * min_distance + origin as Vector;

        ProjectileManager.CreateLinearProjectile({
            Ability: this,
            EffectName: "",
            vSpawnOrigin: caster.GetAttachmentOrigin(caster.ScriptLookupAttachment("attach_hitloc")) as Vector,
            fDistance: (position - origin as Vector).Length2D(),
            Source: caster,
            iUnitTargetTeam: UnitTargetTeam.NONE,
            vVelocity: direction * speed as Vector,
            ExtraData: {
                fx_id: fx_id
            }
        });

        EmitSoundOn("Hero_Onoki.WeightedBoulder.Cast", caster);
        ParticleManager.SetParticleControl(fx_id!, 1, GetGroundPosition(position, undefined) + Vector(0, 0, 75) as Vector);
        ParticleManager.SetParticleControl(fx_id!, 2, Vector(speed, 0, 0));
    }

    /****************************************/

    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, extraData: extra): boolean | void {
        if (target || !this || this.IsNull()) return;

        let caster = this.GetCaster()
        let radius = this.GetSpecialValueFor("radius");
        let duration = this.GetSpecialValueFor("stun_duration_per_armor") * caster.GetPhysicalArmorValue(false);
        let damage = this.GetSpecialValueFor("damage_per_armor") * caster.GetPhysicalArmorValue(false);
        let fx_id = extraData.fx_id;

        let damage_table : ApplyDamageOptions = {
            attacker: caster,
            victim: caster,
            damage: damage,
            damage_type: this.GetAbilityDamageType(),
            ability: this
        }

        let enemies = FindUnitsInRadius(
            caster.GetTeamNumber(),
            location,
            undefined,
            radius,
            UnitTargetTeam.ENEMY,
            UnitTargetType.BASIC + UnitTargetType.HERO,
            UnitTargetFlags.NONE,
            FindOrder.ANY,
            false
        );

        enemies.forEach(enemy => {
            damage_table.victim = enemy;
            ApplyDamage(damage_table);
            enemy.AddNewModifier(caster, this, "modifier_stunned", {duration: duration * (1 - enemy.GetStatusResistance())});
            EmitSoundOn("Hero_Onoki.WeightedBoulder.Stun", enemy);
        });

        EmitSoundOnLocationWithCaster(location, "Hero_Onoki.WeightedBoulder.Impact", caster);
        ParticleManager.DestroyParticle(fx_id!, false);
        ParticleManager.ReleaseParticleIndex(fx_id!);
    }
}
