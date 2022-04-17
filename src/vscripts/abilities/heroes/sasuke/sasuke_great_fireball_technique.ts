import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class sasuke_great_fireball_technique extends BaseAbility {

    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle",  "particles/units/heroes/sasuke/sasuke_great_fireball_technique_technique.vpcf", context);
        PrecacheResource("particle",  "particles/units/heroes/sasuke/sasuke_great_fireball_technique_impact.vpcf", context);
        PrecacheResource("particle",  "particles/units/heroes/sasuke/sasuke_great_fireball_technique_debuff.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/sasuke/game_sounds_sasuke.vsndevts", context);
        //PrecacheResource("soundfile", "soundevents/heroes/sasuke/game_sounds_vo_sasuke.vsndevts", context);
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();
        let position = this.GetCursorPosition();
        let radius = this.GetSpecialValueFor("radius");
        let speed = this.GetSpecialValueFor("speed");

        let direction = position - caster.GetAbsOrigin() as Vector;
        direction.z = 0;
        direction = direction.Normalized();

        ProjectileManager.CreateLinearProjectile({
            Ability: this,
            EffectName: "particles/units/heroes/sasuke/sasuke_great_fireball_technique.vpcf",
            vSpawnOrigin: caster.GetAttachmentOrigin(caster.ScriptLookupAttachment("attach_mouth")) as Vector,
            fDistance: this.GetEffectiveCastRange(position, caster),
            Source: caster,
            fStartRadius: radius,
            fEndRadius: radius,
            iUnitTargetTeam: UnitTargetTeam.ENEMY,
            iUnitTargetType: UnitTargetType.BASIC + UnitTargetType.HERO,
            iUnitTargetFlags: UnitTargetFlags.NONE,
            vVelocity: direction * speed as Vector
        });

        EmitSoundOn("Hero_Sasuke.GreatFireball.Cast", caster);
    }

    /****************************************/

    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (!target || !this || this.IsNull()) return;
        let caster = this.GetCaster();

        let damage_table : ApplyDamageOptions = {
            attacker: caster,
            victim: target,
            damage: this.GetSpecialValueFor("damage"),
            damage_type: this.GetAbilityDamageType(),
            ability: this
        }

        ApplyDamage(damage_table);
        target.AddNewModifier(caster, this, "modifier_sasuke_great_fireball_technique", {duration: this.GetSpecialValueFor("duration") * (1 - target.GetStatusResistance())});

        ParticleManager.ReleaseParticleIndex(
            ParticleManager.CreateParticle("particles/units/heroes/sasuke/sasuke_great_fireball_technique_impact.vpcf", ParticleAttachment.ABSORIGIN, target)
        );

        EmitSoundOn("Hero_Sasuke.GreatFireball.Impact", target);
    }
}

@registerModifier()
export class modifier_sasuke_great_fireball_technique extends BaseModifier
{
    move_slow?: number;
    dps?: number;
    damage_table?: ApplyDamageOptions;

    /****************************************/

    OnCreated(params: object): void {
        let ability = this.GetAbility()!;
        this.move_slow = -ability.GetSpecialValueFor("move_slow");
        this.dps = ability.GetSpecialValueFor("debuff_dps");
        let interval = ability.GetSpecialValueFor("dps_interval");

        if (!IsServer()) return;
        this.damage_table = {
            attacker: this.GetCaster()!,
            victim: this.GetParent(),
            damage: this.dps * interval,
            damage_type: this.GetAbility()?.GetAbilityDamageType()!,
            ability: this.GetAbility()
        }

        this.StartIntervalThink(interval);
        this.OnIntervalThink();
    }

    /****************************************/

    OnIntervalThink(): void {
        ApplyDamage(this.damage_table!);
        SendOverheadEventMessage(undefined, OverheadAlert.BONUS_SPELL_DAMAGE, this.GetParent(), this.damage_table!.damage, undefined);
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.MOVESPEED_BONUS_PERCENTAGE,
    ]}

    /****************************************/

    GetModifierMoveSpeedBonus_Percentage(): number {
        return this.move_slow!;
    }

    /****************************************/
    
    GetEffectName(): string {
        return "particles/units/heroes/sasuke/sasuke_great_fireball_technique_debuff.vpcf"
    }

    /****************************************/

    GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.ABSORIGIN_FOLLOW
    }

    /****************************************/
}