import { BaseAbility, BaseModifier, BaseModifierMotionHorizontal, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

interface kv {
	target: EntityIndex;
}

interface AbilityWithPhaseStartFX
{
    lightning_blade_fx?: ParticleID;
}

@registerAbility()
export class kakashi_lightning_blade extends BaseAbility implements AbilityWithPhaseStartFX
{
    lightning_blade_fx?: ParticleID;
    active_target?: CDOTA_BaseNPC;

    /****************************************/

    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle", "particles/units/heroes/kakashi/chidori.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/kakashi/game_sounds_kakashi.vsndevts", context);
        PrecacheResource("soundfile", "soundevents/heroes/kakashi/game_sounds_vo_kakashi.vsndevts", context);
    }

    /****************************************/

    GetCastPoint(): number {
        return super.GetCastPoint() - this.GetCaster().FindTalentValue("special_bonus_kakashi_2");
    }

    /****************************************/

    OnAbilityPhaseStart(): boolean {
        let caster = this.GetCaster();
        this.active_target = this.GetCursorTarget();

        this.lightning_blade_fx = ParticleManager.CreateParticle("particles/units/heroes/kakashi/chidori.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, caster);
        ParticleManager.SetParticleControlEnt(this.lightning_blade_fx, 0, caster, ParticleAttachment.POINT_FOLLOW, "attach_right_hand", caster.GetAbsOrigin(), true);

        EmitSoundOn("VO_Hero_Kakashi.LightningBlade.Precast", caster)
	    EmitSoundOn("Hero_Kakashi.LightningBlade.Precast", caster)

        this.active_target!.AddNewModifier(caster, this, "modifier_kakashi_lightning_blade_target", {duration: -1})

        return true;
    }

    /****************************************/

    OnAbilityPhaseInterrupted(): void {
        let caster = this.GetCaster();

        ParticleManager.DestroyParticle(this.lightning_blade_fx!, true);
        ParticleManager.ReleaseParticleIndex(this.lightning_blade_fx!);

        StopSoundOn("VO_Hero_Kakashi.LightningBlade.Precast", caster)
	    StopSoundOn("Hero_Kakashi.LightningBlade.Precast", caster)

        this.active_target?.RemoveModifierByName("modifier_kakashi_lightning_blade_target");
        this.active_target = undefined;
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();
        let target = this.GetCursorTarget();

        if (target?.TriggerSpellAbsorb(this)) return;

        caster.AddNewModifier(caster, this, "modifier_kakashi_lightning_blade", {duration: -1, target: target?.entindex()})
        
    }
}

@registerModifier()
export class modifier_kakashi_lightning_blade extends BaseModifierMotionHorizontal
{
    target?: CDOTA_BaseNPC;

    charge_speed?: number;
    damage?: number;
    stun_duration?: number;
    max_distance?: number;

    activity_fired = false;

    cancelling_orders = [
        UnitOrder.STOP,
        UnitOrder.HOLD_POSITION,
        UnitOrder.MOVE_TO_POSITION,
        UnitOrder.MOVE_TO_DIRECTION,
        UnitOrder.MOVE_TO_TARGET,
        UnitOrder.ATTACK_MOVE,
        UnitOrder.CAST_POSITION,
        UnitOrder.CAST_TARGET,
        UnitOrder.CAST_TARGET_TREE,
        UnitOrder.VECTOR_TARGET_POSITION,
        UnitOrder.PATROL
    ]

    /****************************************/

    IsPurgable(): boolean       {return false}
    RemoveOnDeath(): boolean    {return true}

    /****************************************/

    OnCreated(params: kv): void {
        let ability = this.GetAbility()!;

        this.charge_speed = ability.GetSpecialValueFor("charge_speed");
        this.damage = ability.GetSpecialValueFor("damage") + this.GetParent().FindTalentValue("special_bonus_kakashi_1");
        this.stun_duration = ability.GetSpecialValueFor("stun_duration");
        this.max_distance = ability.GetSpecialValueFor("max_distance");

        if (!IsServer()) return;
        EmitSoundOn("Hero_Kakashi.LightningBlade.Loop", this.GetParent());

        this.target = EntIndexToHScript(params.target) as CDOTA_BaseNPC;

        if (!this.ApplyHorizontalMotionController()) {
            this.Destroy()
            return;
        }
    }

    /****************************************/

    OnDestroy(): void {
        if (!IsServer()) return;
        let parent = this.GetParent();
        let ability = this.GetAbility() as AbilityWithPhaseStartFX;

        parent.RemoveHorizontalMotionController(this);

        if (this.target && !this.target.IsNull() && this.target.HasModifier("modifier_kakashi_lightning_blade_target")) {
            this.target.RemoveModifierByName("modifier_kakashi_lightning_blade_target");
        }

        ParticleManager.DestroyParticle(ability!.lightning_blade_fx!, true);
        ParticleManager.ReleaseParticleIndex(ability!.lightning_blade_fx!);
        Timers.CreateTimer(FrameTime(), () => {StopSoundOn("Hero_Kakashi.LightningBlade.Loop", parent)})
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.ON_ORDER,
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
        let direction = (this.target!.GetAbsOrigin() - parent.GetAbsOrigin() as Vector).Normalized();

        this.CheckConditions();
        if (this.CheckDistance()) return;

        parent.FaceTowards(this.target!.GetAbsOrigin());
        parent.SetAbsOrigin(parent.GetAbsOrigin() + this.charge_speed! * direction * dt as Vector);
    }

    /****************************************/

    OnHorizontalMotionInterrupted(): void {
        this.Destroy();
    }

    /****************************************/

    OnOrder(params: ModifierAbilityEvent) {
        if (!IsServer()) return;

        let unit = params.unit;
        let order = params.order_type;

        if (!unit || unit != this.GetParent()) return;

        if (this.cancelling_orders.includes(order)) this.Destroy();

        if (order == UnitOrder.ATTACK_TARGET && params.target != this.target)
            this.Destroy();
    }

    /****************************************/

    GetOverrideAnimation(): GameActivity{
        return GameActivity.DOTA_CHANNEL_ABILITY_5
    }

    /****************************************/

    CheckConditions(): void {
        let parent = this.GetParent();
        if (parent.IsStunned() || parent.IsHexed() || parent.IsRooted() || this.target?.IsNull() || !this.target?.IsAlive()) this.Destroy();
    }

    /****************************************/

    CheckDistance(): boolean {
        let parent = this.GetParent();
        let distance = (parent.GetAbsOrigin() - this.target!.GetAbsOrigin() as Vector).Length2D()

        if (distance <= 350 && !this.activity_fired) {
            this.activity_fired = true;
            parent.StartGesture(GameActivity.DOTA_CAST_ABILITY_7);
        }

        if (distance <= 128) {
            let ability = this.GetAbility();

            ApplyDamage({
                attacker: parent,
                victim: this.target!,
                damage: this.damage!,
                damage_type: this.GetAbility()!.GetAbilityDamageType(),
                ability: this.GetAbility(),
            })

            this.target?.AddNewModifier(parent, ability, "modifier_stunned", {duration: this.stun_duration! * (1 - this.target.GetStatusResistance())})

            EmitSoundOn("Hero_Kakashi.LightningBlade.Impact", this.target!)
			EmitSoundOn("VO_Hero_Kakashi.LightningBlade.Hit", parent)

            let impact_fx = ParticleManager.CreateParticle("particles/units/heroes/hero_zuus/zuus_static_field.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, this.target);
            ParticleManager.ReleaseParticleIndex(impact_fx);

            this.Destroy()
            return true;

        } else if (distance > this.max_distance!) {
            this.Destroy();
            return true;
        }

        return false;
    }   
}

@registerModifier()
export class modifier_kakashi_lightning_blade_target extends BaseModifier
{
    IsHidden(): boolean     {return true}
    IsPurgable(): boolean   {return false}

    /****************************************/

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.PROVIDES_VISION]: true,
        };
    }
}