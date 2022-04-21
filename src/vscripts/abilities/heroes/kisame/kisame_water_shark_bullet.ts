import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class kisame_water_shark_bullet extends BaseAbility
{
    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle", "particles/units/heroes/kisame/kisame_water_shark_bullet_explosion.vpcf", context);
        PrecacheResource("particle", "particles/units/heroes/kisame/shark.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/kisame/game_sounds_kisame.vsndevts", context);
        //PrecacheResource("soundfile", "soundevents/heroes/kisame/game_sounds_vo_kisame.vsndevts", context);
    }

    /****************************************/

    OnAbilityPhaseStart(): boolean {
        EmitSoundOn("Hero_Kisame.WaterSharkBullet.Talk", this.GetCaster());
        return true
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();
        let position = this.GetCursorPosition();
        let distance = this.GetCastRange(position, undefined);
        let radius = this.GetSpecialValueFor("shark_radius");

        let direction = position - caster.GetAbsOrigin() as Vector;
        direction.z = 0;
        direction = direction.Normalized();
        let spawn_pos = caster.GetAttachmentOrigin(caster.ScriptLookupAttachment("attach_hitloc")) + direction * 75 as Vector;
        
        ProjectileManager.CreateLinearProjectile({
            Ability: this,
            EffectName: "particles/units/heroes/kisame/shark.vpcf",
            vSpawnOrigin: spawn_pos,
            fDistance: distance,
            fStartRadius: radius,
            fEndRadius: radius,
            Source: caster,
            iUnitTargetTeam: this.GetAbilityTargetTeam(),
            iUnitTargetType: this.GetAbilityTargetType(),
            iUnitTargetFlags: this.GetAbilityTargetFlags(),
            vVelocity: direction * this.GetSpecialValueFor("shark_speed") as Vector
        });
        
        EmitSoundOn("Hero_Kisame.WaterSharkBullet.Cast", caster);
    }

    /****************************************/

    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (!target) return true;
        let caster = this.GetCaster();
        let duration = this.GetSpecialValueFor("duration");
        let radius = this.GetSpecialValueFor("explosion_radius");

        let enemies = FindUnitsInRadius(
            caster.GetTeamNumber(),
            location,
            undefined,
            radius,
            this.GetAbilityTargetTeam(),
            this.GetAbilityTargetType(),
            this.GetAbilityTargetFlags(),
            FindOrder.ANY,
            false
        )

        let damage_table: ApplyDamageOptions = {
            attacker: caster,
            victim: caster,
            damage: this.GetSpecialValueFor("damage"),
            damage_type: this.GetAbilityDamageType(),
            ability: this
        }

        enemies.forEach(enemy => {
            damage_table.victim = enemy;
            ApplyDamage(damage_table);

            enemy.AddNewModifier(caster, this, "modifier_kisame_water_shark_bullet", {duration: duration * (1 - enemy.GetStatusResistance())});
        });

        let explosion_fx = ParticleManager.CreateParticle("particles/units/heroes/kisame/kisame_water_shark_bullet_explosion.vpcf", ParticleAttachment.CUSTOMORIGIN, undefined);
        ParticleManager.SetParticleControl(explosion_fx, 0, location);
        ParticleManager.SetParticleControl(explosion_fx, 1, Vector(radius, 0, 0));
        ParticleManager.SetParticleControl(explosion_fx, 3, Vector(radius, 0, 0));
        ParticleManager.ReleaseParticleIndex(explosion_fx);

        EmitSoundOnLocationWithCaster(location, "Hero_Kisame.WaterSharkBullet.Explosion", caster);

        return true;
    }
}

@registerModifier()
export class modifier_kisame_water_shark_bullet extends BaseModifier
{
    move_slow?: number;
    armor_reduction?: number;

    /****************************************/

    OnCreated(params: object): void {
        let ability = this.GetAbility();

        this.move_slow = -ability!.GetSpecialValueFor("move_slow");
        this.armor_reduction = -ability!.GetSpecialValueFor("armor_reduction");
    }
    
    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.MOVESPEED_BONUS_PERCENTAGE,
        ModifierFunction.PHYSICAL_ARMOR_BONUS
    ]}

    /****************************************/

    GetModifierMoveSpeedBonus_Percentage(): number {
        return this.move_slow!
    }

    /****************************************/

    GetModifierPhysicalArmorBonus(): number {
        return this.armor_reduction!;
    }

    /****************************************/

    GetEffectName(): string {
        return "particles/units/heroes/hero_siren/naga_siren_riptide_debuff.vpcf";
    }

    /****************************************/

    GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.ABSORIGIN_FOLLOW;
    }
}