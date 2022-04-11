import { BaseAbility, BaseModifier, BaseModifierMotionHorizontal, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

interface kv {
	x: number;
    y: number;
    z: number;
}

@registerAbility()
export class raikage_lariat extends BaseAbility
{
    lightning_blade_fx?: ParticleID;
    active_target?: CDOTA_BaseNPC;

    /****************************************/

    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle", "particles/units/heroes/raikage/raikage_lariat_impact.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/raikage/game_sounds_raikage.vsndevts", context);
        PrecacheResource("soundfile", "soundevents/heroes/raikage/game_sounds_vo_raikage.vsndevts", context);
    }

    /****************************************/

    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return IsClient() ? super.GetCastRange(location, target) : 50000;
    }

    /****************************************/

    OnAbilityPhaseStart(): boolean {
        EmitSoundOn("VO_Hero_Raikage.Lariat.Cast", this.GetCaster());

        return true;
    }

    /****************************************/

    OnAbilityPhaseInterrupted(): void {
        StopSoundOn("VO_Hero_Raikage.Lariat.Cast", this.GetCaster());
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();
        let position = this.GetCursorPosition();
        let origin = caster.GetAbsOrigin();
        let range = this.GetSpecialValueFor("cast_range");
        let distance = (position - origin as Vector).Length2D();
        position = distance < range ? position : (position - origin as Vector).Normalized() * range + origin as Vector;

        caster.AddNewModifier(caster, this, "modifier_raikage_lariat", {duration: -1, x: position.x, y: position.y, z: position.z})

        EmitSoundOn("Hero_Raikage.Lariat.Cast", caster);
    }
}

@registerModifier()
export class modifier_raikage_lariat extends BaseModifierMotionHorizontal
{
    position?: Vector;
    origin?: Vector;

    damage?: number;
    stun_duration?: number;
    speed?: number;
    search_radius?: number;
    distance_to_cross?: number;

    /****************************************/

    IsPurgable(): boolean       {return false}
    RemoveOnDeath(): boolean    {return true}

    /****************************************/

    OnCreated(params: kv): void {
        let ability = this.GetAbility()!;
        let parent = this.GetParent();

        this.stun_duration = ability.GetSpecialValueFor("stun_duration");
        this.speed = ability.GetSpecialValueFor("speed");
        this.damage = ability.GetSpecialValueFor("damage") + parent.FindTalentValue("special_bonus_raikage_3");
        this.search_radius = parent.GetPaddedCollisionRadius() * 2;

        if (!IsServer()) return;
        this.origin = parent.GetAbsOrigin();
        this.position = Vector(params.x, params.y, params.z);
        this.distance_to_cross = (this.position - parent!.GetAbsOrigin() as Vector).Length2D();

        if (!this.ApplyHorizontalMotionController()) {
            this.Destroy()
            return;
        }

        let ground_fx = ParticleManager.CreateParticle("particles/units/heroes/raikage/lariat_ground_parent.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, parent)
        this.AddParticle(ground_fx, false, false, -1, false, false);
    }

    /****************************************/

    OnDestroy(): void {
        if (!IsServer()) return;
        let parent = this.GetParent();

        parent.RemoveHorizontalMotionController(this);
        GridNav.DestroyTreesAroundPoint(parent.GetAbsOrigin(), this.search_radius!, true);

        if(GridNav.IsBlocked(parent.GetAbsOrigin()))
            FindClearSpaceForUnit(parent, parent.GetAbsOrigin(), false);
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.OVERRIDE_ANIMATION,
    ]}

    /****************************************/

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.NO_UNIT_COLLISION]: true,
            [ModifierState.FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
         };
    }

    /****************************************/

    UpdateHorizontalMotion(parent: CDOTA_BaseNPC, dt: number): void {
        let direction = (this.position! - parent.GetAbsOrigin() as Vector).Normalized();

        if (this.CheckConditions() || this.CheckAreaForEnemies() || this.CheckDistance()) {
            this.Destroy();
            return;
        }

        parent.FaceTowards(this.position!);
        parent.SetAbsOrigin(parent.GetAbsOrigin() + this.speed! * direction * dt as Vector);
    }

    /****************************************/

    OnHorizontalMotionInterrupted(): void {
        this.Destroy();
    }

    /****************************************/

    GetOverrideAnimation(): GameActivity{
        return GameActivity.DOTA_CAST_ABILITY_2;
    }

    /****************************************/

    CheckConditions(): boolean {
        let parent = this.GetParent();
        if (parent.IsStunned() || parent.IsHexed() || parent.IsRooted()) {
            return true;
        }

        return false;
    }

    /****************************************/

    CheckAreaForEnemies(): boolean {
        let parent = this.GetParent();
        let enemies = FindUnitsInRadius(
            parent.GetTeamNumber(),
            parent.GetAbsOrigin(),
            undefined,
            this.search_radius!,
            UnitTargetTeam.ENEMY,
            UnitTargetType.BASIC + UnitTargetType.HERO,
            UnitTargetFlags.NO_INVIS,
            FindOrder.ANY,
            false
        );

        for(let enemy of enemies){
            if (this.IsFacingTarget(enemy)) {
                let ability = this.GetAbility();

                enemy.AddNewModifier(parent, ability, "modifier_stunned", {duration: this.stun_duration! * (1 - enemy.GetStatusResistance())});

                ApplyDamage({
                    attacker: parent,
                    victim: enemy,
                    damage: this.damage!,
                    damage_type: ability!.GetAbilityDamageType(),
                    ability: ability
                });

                let impact_fx = ParticleManager.CreateParticle("particles/units/heroes/raikage/raikage_lariat_impact.vpcf", ParticleAttachment.ABSORIGIN, enemy);
                ParticleManager.SetParticleControl(impact_fx, 3, enemy.GetAbsOrigin() + Vector(0, 0, 70) as Vector);
                ParticleManager.ReleaseParticleIndex(impact_fx);
                EmitSoundOn("Hero_Raikage.Lariat.Impact", enemy);
                return true;
            }
        }

        return false;
    }

    /****************************************/

    CheckDistance(): boolean {
        let parent = this.GetParent();
        let distance = (parent.GetAbsOrigin() - this.origin! as Vector).Length2D()

        if (distance >= this.distance_to_cross!) {
            return true;
        }

        return false;
    }

    /****************************************/

    IsFacingTarget(target: CDOTA_BaseNPC): boolean {
        let direction = (target.GetAbsOrigin() - this.GetParent().GetAbsOrigin() as Vector).Normalized();
        let parent_facing_direction = this.GetParent().GetForwardVector();

        return parent_facing_direction.Dot(direction) > 0;
    }

    /****************************************/

    GetEffectName(): string {
        return "particles/units/heroes/raikage/lariat_aura.vpcf";
    }

    /****************************************/

    GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.ABSORIGIN_FOLLOW;
    }
}