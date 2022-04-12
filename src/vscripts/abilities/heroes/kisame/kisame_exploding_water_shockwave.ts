import { BaseAbility, BaseModifier, BaseModifierMotionHorizontal, BaseModifierMotionVertical, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

interface kv {
	handle: ProjectileID;
}

@registerAbility()
export class kisame_exploding_water_shockwave extends BaseAbility
{
    /****************************************/

    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle", "particles/units/heroes/kisame/kisame_exploding_water_shockwave.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/kisame/game_sounds_kisame.vsndevts", context);
        //PrecacheResource("soundfile", "soundevents/heroes/kisame/game_sounds_vo_kisame.vsndevts", context);
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();
        let position = this.GetCursorPosition();
        let radius = this.GetSpecialValueFor("wave_radius");
        let origin = caster.GetAbsOrigin() - caster.GetForwardVector() * 100 as Vector;
        let direction = (position - origin as Vector).Normalized();
        let distance = this.GetCastRange(position, undefined) + 100;
        
        let id = ProjectileManager.CreateLinearProjectile({
            Ability: this,
            EffectName: "particles/units/heroes/kisame/kisame_exploding_water_shockwave.vpcf",
            vSpawnOrigin: origin,
            fDistance: distance,
            fStartRadius: radius,
            fEndRadius: radius,
            Source: caster,
            bHasFrontalCone: true,
            iUnitTargetTeam: UnitTargetTeam.ENEMY,
            iUnitTargetType: UnitTargetType.BASIC + UnitTargetType.HERO,
            vVelocity: direction * this.GetSpecialValueFor("wave_speed") as Vector,
            iVisionRadius: radius,
            iVisionTeamNumber: caster.GetTeamNumber()
        })

        caster.AddNewModifier(caster, this, "modifier_kisame_exploding_water_shockwave", {duration: -1, handle: id});

        EmitSoundOn("Hero_Kisame.ExplodingWaterShockwave.Cast", caster);
        EmitSoundOn("Hero_Kisame.ExplodingWaterShockwave.Target", caster);
    }
    
    /****************************************/

    OnProjectileHitHandle(target: CDOTA_BaseNPC | undefined, location: Vector, projectileHandle: ProjectileID): boolean | void {
        if (!target) return;

        let caster = this.GetCaster();

        ApplyDamage({
            attacker: caster,
            victim: target,
            damage: this.GetSpecialValueFor("damage"),
            damage_type: this.GetAbilityDamageType(),
            ability: this
        })

        target.AddNewModifier(caster, this, "modifier_kisame_exploding_water_shockwave", {duration: -1, handle: projectileHandle});

        EmitSoundOn("Hero_Kisame.ExplodingWaterShockwave.Target", target);
    }

}

@registerModifier()
export class modifier_kisame_exploding_water_shockwave extends BaseModifierMotionHorizontal
{
    projectile?: ProjectileID;

    /****************************************/

    IsPurgable(): boolean       {return false}
    RemoveOnDeath(): boolean    {return true}

    /****************************************/

    OnCreated(params: kv): void {
        if (!IsServer()) return;

        this.projectile = params.handle;

        if (!this.ApplyHorizontalMotionController()) {
            this.Destroy();
            return;
        }
    }

    /****************************************/

    OnDestroy(): void {
        if (!IsServer()) return;
        this.GetParent().RemoveHorizontalMotionController(this);
    }

    /****************************************/

    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
        if (!ProjectileManager.IsValidProjectile(this.projectile!)) {
            this.Destroy();
            return;
        }

        me.SetAbsOrigin(me.GetAbsOrigin() + ProjectileManager.GetLinearProjectileVelocity(this.projectile) * dt as Vector);
    }

    /****************************************/

    OnHorizontalMotionInterrupted(): void {
        this.Destroy();
    }

    /****************************************/

    CheckState(): Partial<Record<ModifierState, boolean>> {return {[ModifierState.STUNNED]: this.GetParent() != this.GetCaster()}}
}