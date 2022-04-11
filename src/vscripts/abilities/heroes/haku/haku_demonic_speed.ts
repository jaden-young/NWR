import { BaseAbility, BaseModifier, BaseModifierMotionHorizontal, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

interface kv {
	x: number;
    y: number;
    z: number;
}

@registerAbility()
export class haku_demonic_speed extends BaseAbility
{
    lightning_blade_fx?: ParticleID;
    active_target?: CDOTA_BaseNPC;

    /****************************************/

    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle", "particles/units/heroes/haku/haku_demonic_speed.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/haku/game_sounds_haku.vsndevts", context);
        //PrecacheResource("soundfile", "soundevents/heroes/haku/game_sounds_vo_haku.vsndevts", context);
    }

    /****************************************/

    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return IsClient() ? super.GetCastRange(location, target) : 50000;
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();
        let position = this.GetCursorPosition();
        let origin = caster.GetAbsOrigin();
        let range = this.GetSpecialValueFor("cast_range");
        let distance = (position - origin as Vector).Length2D();
        position = distance < range ? position : (position - origin as Vector).Normalized() * range + origin as Vector;

        caster.AddNewModifier(caster, this, "modifier_haku_demonic_speed", {duration: -1, x: position.x, y: position.y, z: position.z})

        EmitSoundOn("Hero_Haku.DemonicSpeed.Cast", caster);
    }
}

@registerModifier()
export class modifier_haku_demonic_speed extends BaseModifierMotionHorizontal
{
    position?: Vector;
    origin?: Vector;

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

        this.speed = 1900//ability.GetSpecialValueFor("speed");
        this.search_radius = ability.GetSpecialValueFor("attack_search_range");

        if (!IsServer()) return;
        this.origin = parent.GetAbsOrigin();
        this.position = Vector(params.x, params.y, params.z);
        this.distance_to_cross = (this.position - parent!.GetAbsOrigin() as Vector).Length2D();

        if (!this.ApplyHorizontalMotionController()) {
            this.Destroy()
            return;
        }

        this.StartIntervalThink(FrameTime());
        this.OnIntervalThink();
    }

    /****************************************/

    OnDestroy(): void {
        if (!IsServer()) return;
        let parent = this.GetParent();

        parent.RemoveHorizontalMotionController(this);
        GridNav.DestroyTreesAroundPoint(parent.GetAbsOrigin(), 150, true);

        if(GridNav.IsBlocked(parent.GetAbsOrigin()))
            FindClearSpaceForUnit(parent, parent.GetAbsOrigin(), false);
    }

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

        if (this.CheckDistance()) {
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

    OnIntervalThink(): void {
        let parent = this.GetParent();
        let enemy = undefined;
        let enemies = FindUnitsInRadius(
            parent.GetTeamNumber(),
            parent.GetAbsOrigin(),
            undefined,
            this.search_radius!,
            UnitTargetTeam.ENEMY,
            UnitTargetType.HERO,
            UnitTargetFlags.NO_INVIS + UnitTargetFlags.FOW_VISIBLE,
            FindOrder.CLOSEST,
            false
        );


        if (enemies.length == 0)
            enemies = FindUnitsInRadius(
                parent.GetTeamNumber(),
                parent.GetAbsOrigin(),
                undefined,
                this.search_radius!,
                UnitTargetTeam.ENEMY,
                UnitTargetType.HERO + UnitTargetType.BASIC,
                UnitTargetFlags.NO_INVIS + UnitTargetFlags.FOW_VISIBLE,
                FindOrder.CLOSEST,
                false
            );
        
        if (enemies.length > 0) {
            enemy = enemies[0]
            parent.PerformAttack(enemy, false, true, true, false, true, false, false);
            this.StartIntervalThink(-1);
        }
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

    GetEffectName(): string {
        return "particles/units/heroes/haku/haku_demonic_speed.vpcf";
    }

    /****************************************/

    GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.ABSORIGIN_FOLLOW;
    }
}