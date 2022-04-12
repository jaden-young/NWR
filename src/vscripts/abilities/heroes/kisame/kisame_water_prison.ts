import { BaseAbility, BaseModifier, BaseModifierMotionVertical, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

interface RisingMotionModifier extends CDOTA_Buff 
{
    SetFalling(): void;
}

@registerAbility()
export class kisame_water_prison extends BaseAbility
{
    target?: CDOTA_BaseNPC_Hero;

    /****************************************/

    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle", "particles/units/heroes/kisame/kisame_water_prison.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/kisame/game_sounds_kisame.vsndevts", context);
        //PrecacheResource("soundfile", "soundevents/heroes/kisame/game_sounds_vo_kisame.vsndevts", context);
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();
        let target = this.GetCursorTarget();
        let channel_time = this.GetChannelTime();

        if (target?.TriggerSpellAbsorb(this)) return;

        this.target = target as CDOTA_BaseNPC_Hero;

        target?.AddNewModifier(caster, this, "modifier_kisame_water_prison", {duration: channel_time});
        target?.AddNewModifier(caster, this, "modifier_kisame_water_prison_motion", {duration: channel_time + 0.6});
        caster.AddNewModifier(caster, this, "modifier_kisame_water_prison_resistance", {duration: channel_time});

        EmitSoundOn("Hero_Kisame.WaterPrison.Target", target!);
        EmitSoundOn("Hero_Kisame.WaterPrison.Target.Loop", target!);
    }

    /****************************************/

    OnChannelFinish(interrupted: boolean): void {
        let caster = this.GetCaster();
        this.target?.RemoveModifierByNameAndCaster("modifier_kisame_water_prison", caster);
        
        let motion_modifier = this.target!.FindModifierByName("modifier_kisame_water_prison_motion") as RisingMotionModifier;
        if (motion_modifier) {
            motion_modifier.SetFalling();
        }

        EmitSoundOn("Hero_Kisame.WaterPrison.Burst", this.target!);

        Timers.CreateTimer(FrameTime(), () =>
            StopSoundOn("Hero_Kisame.WaterPrison.Target.Loop", this.target!)
        )
    }
}

@registerModifier()
export class modifier_kisame_water_prison extends BaseModifierMotionVertical
{
    damage_per_second?: number;
    interval?: number;
    damage_table?: ApplyDamageOptions;

    /****************************************/

    IsPurgable(): boolean       {return false}
    RemoveOnDeath(): boolean    {return true}

    /****************************************/

    OnCreated(params: Object): void {
        let ability = this.GetAbility()!;
        let parent = this.GetParent();

        this.interval = ability.GetSpecialValueFor("interval");
        this.damage_per_second = ability.GetSpecialValueFor("damage_per_second") * this.interval;
        
        if (!IsServer()) return;

        this.damage_table = {
            attacker: this.GetCaster()!,
            victim: parent,
            damage: this.damage_per_second,
            damage_type: this.GetAbility()?.GetAbilityDamageType()!,
            ability: this.GetAbility()
        }

        this.StartIntervalThink(this.interval);
        this.OnIntervalThink();
        
        let prison_fx = ParticleManager.CreateParticle("particles/units/heroes/kisame/kisame_water_prison.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, parent);
        ParticleManager.SetParticleControlEnt(prison_fx, 0, parent, ParticleAttachment.POINT_FOLLOW, "attach_hitloc", parent.GetAbsOrigin(), true);
        this.AddParticle(prison_fx, false, false, -1, false, false);
    }

    /****************************************/

    OnIntervalThink(): void {
        ApplyDamage(this.damage_table!);
    }

    /****************************************/

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.PROVIDES_VISION]: true,
            [ModifierState.STUNNED]: true,
            [ModifierState.SILENCED]: true
        };
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.OVERRIDE_ANIMATION,
        ModifierFunction.TOOLTIP,
        ModifierFunction.TOOLTIP2
    ]}

    /****************************************/

    GetOverrideAnimation(): GameActivity {
        return GameActivity.DOTA_FLAIL
    }

    /****************************************/

    OnTooltip(): number {
        return this.damage_per_second!;
    }

    /****************************************/

    OnTooltip2(): number {
        return this.interval!;
    }
}

interface RisingMotionModifier extends BaseModifierMotionVertical 
{
    SetFalling(): void;
}

@registerModifier()
export class modifier_kisame_water_prison_motion extends BaseModifierMotionVertical 
{
    is_rising: boolean = true;
    steps: number = 0;
    max_offset: number = 0;

    /****************************************/

    IsHidden(): boolean         {return true}
    IsPurgable(): boolean       {return false}
    RemoveOnDeath(): boolean    {return true}

    /****************************************/

    OnCreated(params: object): void {
        if (!IsServer()) return;

        if (!this.ApplyVerticalMotionController()) {
            this.Destroy()
            return;
        }
    }

    /****************************************/
    OnDestroy(): void {
        if (!IsServer()) return;
        this.GetParent().RemoveVerticalMotionController(this);
    }

    /****************************************/

    SetFalling(): void {
        this.steps = 0.3 / FrameTime();
        this.is_rising = false;
    }

    /****************************************/

    UpdateVerticalMotion(me: CDOTA_BaseNPC, dt: number): void {
        let origin = me.GetAbsOrigin();
        let offset = this.is_rising ? 50 : -this.max_offset / this.steps;
        me.SetAbsOrigin(origin + Vector(0, 0, offset) * dt as Vector);

        this.max_offset = this.is_rising ? offset * this.steps : this.max_offset;
        this.is_rising ? this.steps++ : this.steps--;

        if (!this.is_rising && this.steps < 5) this.Destroy();
    }

    /****************************************/

    OnVerticalMotionInterrupted(): void {
        this.Destroy();
    }
}

@registerModifier()
export class modifier_kisame_water_prison_resistance extends BaseModifier
{
    damage_reduction?: number;

    /****************************************/

    OnCreated(params: object): void {
        this.damage_reduction = -this.GetAbility()!.GetSpecialValueFor("damage_reduction");
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.INCOMING_DAMAGE_PERCENTAGE
    ]}

    /****************************************/

    GetModifierIncomingDamage_Percentage(): number {
        return this.damage_reduction!;
    }
}