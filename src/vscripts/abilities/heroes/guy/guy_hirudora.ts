import { BaseAbility, registerAbility} from "../../../lib/dota_ts_adapter"

@registerAbility()
export class guy_hirudora extends BaseAbility
{
    Precache(context: CScriptPrecacheContext): void{
        //PrecacheResource("particle", "", context);
        PrecacheResource("soundfile", "soundevents/heroes/guy/game_sounds_guy.vsndevts", context);
        //PrecacheResource("soundfile", "soundevents/heroes/guy/game_sounds_vo_guy.vsndevts", context);
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();
        let position = this.GetCursorPosition();
        let distance = this.GetCastRange(position, undefined);
        let radius = this.GetSpecialValueFor("radius");

        let direction = position - caster.GetAbsOrigin() as Vector;
        direction.z = 0;
        direction = direction.Normalized();
        let spawn_pos = caster.GetAttachmentOrigin(caster.ScriptLookupAttachment("attach_hitloc")) + direction * 75 as Vector;
        
        ProjectileManager.CreateLinearProjectile({
            Ability: this,
            EffectName: "particles/units/heroes/hero_vengeful/vengeful_wave_of_terror.vpcf",
            vSpawnOrigin: spawn_pos,
            fDistance: distance,
            fStartRadius: radius,
            fEndRadius: radius,
            Source: caster,
            iUnitTargetTeam: this.GetAbilityTargetTeam(),
            iUnitTargetType: this.GetAbilityTargetType(),
            iUnitTargetFlags: this.GetAbilityTargetFlags(),
            vVelocity: direction * this.GetSpecialValueFor("speed") as Vector
        });

        ApplyDamage({
            attacker: caster,
            victim: caster,
            damage: caster.GetHealth() * this.GetSpecialValueFor("hp_cost") / 100,
            damage_type: DamageTypes.PURE,
            damage_flags: DamageFlag.NON_LETHAL + DamageFlag.NO_SPELL_AMPLIFICATION + DamageFlag.NO_SPELL_LIFESTEAL + DamageFlag.REFLECTION,
            ability: this
        })
        
        EmitSoundOn("Hero_Guy.Hirudora.Cast", caster);
    }

    /****************************************/

    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (!target) return true;
        let caster = this.GetCaster();

        ApplyDamage({
            attacker: caster,
            victim: target,
            damage: caster.GetAverageTrueAttackDamage(undefined) * this.GetSpecialValueFor("attack_damage") / 100,
            damage_type: this.GetAbilityDamageType(),
            ability: this
        })

        let hit_fx = ParticleManager.CreateParticle("particles/units/heroes/hero_vengeful/vengeful_wave_of_terror_recipient.vpcf", ParticleAttachment.ABSORIGIN, target);
        ParticleManager.DestroyParticle(hit_fx, false);
        ParticleManager.ReleaseParticleIndex(hit_fx);

        EmitSoundOn("Hero_Guy.Hirudora.Impact", target);    

        return false;
    }
}