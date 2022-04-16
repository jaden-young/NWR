import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

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
        ParticleManager.SetParticleControl(this.rock_fx, 0, caster.GetAttachmentOrigin(caster.ScriptLookupAttachment("attach_hitloc")) + direction * 100 as Vector);

        EmitSoundOn("Hero_Onoki.AtomicDismantling.Precast", caster);
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
        let speed = this.GetSpecialValueFor("speed")

        let direction = position - caster.GetAbsOrigin() as Vector;
        direction.z = 0;
        direction = direction.Normalized();

        ProjectileManager.CreateLinearProjectile({
            Ability: this,
            EffectName: "",
            vSpawnOrigin: caster.GetAttachmentOrigin(caster.ScriptLookupAttachment("attach_hitloc")) + direction * 75 as Vector,
            fDistance: (position - origin as Vector).Length2D(),
            Source: caster,
            iUnitTargetTeam: UnitTargetTeam.NONE,
            vVelocity: direction * speed as Vector,
        });

        EmitSoundOn("Hero_Onoki.WeightedBoulder.Cast", caster);
        ParticleManager.SetParticleControl(this.rock_fx!, 1, GetGroundPosition(position, undefined) + Vector(0, 0, 75) as Vector);
        ParticleManager.SetParticleControl(this.rock_fx!, 2, Vector(speed, 0, 0));
    }

    /****************************************/

    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (target || !this || this.IsNull()) return;

        let caster = this.GetCaster()
        let radius = this.GetSpecialValueFor("radius");
        let duration = this.GetSpecialValueFor("stun_duration_per_armor") * caster.GetPhysicalArmorValue(false);
        let damage = this.GetSpecialValueFor("damage_per_armor") * caster.GetPhysicalArmorValue(false);

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
        });

        EmitSoundOnLocationWithCaster(location, "Hero_Onoki.WeightedBoulder.Impact", caster);
        ParticleManager.DestroyParticle(this.rock_fx!, false);
        ParticleManager.ReleaseParticleIndex(this.rock_fx!);
    }

    /****************************************/

    ApplySecondEffect(location: Vector) {
        if (!this || this.IsNull()) return;

        let caster = this.GetCaster()
        let radius = this.GetSpecialValueFor("radius");
        let stun_duration = this.GetSpecialValueFor("stun_duration");

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
            enemy.AddNewModifier(caster, this, "modifier_stunned", {duration: stun_duration * (1 - enemy.GetStatusResistance())});
            EmitSoundOn("Hero_Onoki.AtomicDismantling.Stun", enemy);
        });
    }
}

@registerModifier()
export class modifier_onoki_weighted_boulder extends BaseModifier
{
    IsPurgable(): boolean       {return true}

    /****************************************/

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {[ModifierState.ROOTED]: true};
    }

    /****************************************/

    GetEffectName(): string {
        return "particles/units/heroes/hero_treant/treant_bramble_root.vpcf";
    }

    /****************************************/
    
    GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.ABSORIGIN;
    }
}
