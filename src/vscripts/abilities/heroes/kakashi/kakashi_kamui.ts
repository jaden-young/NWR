import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class kakashi_kamui extends BaseAbility
{
    target?: CDOTA_BaseNPC_Hero;

    /****************************************/

    Precache(context: CScriptPrecacheContext): void{
        //PrecacheResource("particle", "particles/units/heroes/kakashi/chidori.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/kakashi/game_sounds_kakashi.vsndevts", context);
        PrecacheResource("soundfile", "soundevents/heroes/kakashi/game_sounds_vo_kakashi.vsndevts", context);
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();
        let target = this.GetCursorTarget();
        let channel_time = this.GetChannelTime();

        if (target?.TriggerSpellAbsorb(this)) return;

        this.target = target as CDOTA_BaseNPC_Hero;

        target?.AddNewModifier(caster, this, "modifier_kakashi_kamui", {duration: channel_time});
        caster.AddNewModifier(caster, this, "modifier_kakashi_kamui_channeling", {duration: channel_time});

        EmitSoundOn("Hero_Kakashi.Kamui.Channel", caster);
        EmitSoundOn("Hero_Kakashi.Kamui.Channel", target!);
    }

    /****************************************/

    OnChannelThink(interval: number): void {
        let caster = this.GetCaster();

        if ((caster.GetAbsOrigin() - this.target!.GetAbsOrigin() as Vector).Length2D() > this.GetSpecialValueFor("focus_range"))
            caster.InterruptChannel();
    }

    /****************************************/

    OnChannelFinish(interrupted: boolean): void {
        let caster = this.GetCaster();
        this.target?.RemoveModifierByNameAndCaster("modifier_kakashi_kamui", caster);
        caster.RemoveModifierByName("modifier_kakashi_kamui_channeling");

        StopSoundOn("Hero_Kakashi.Kamui.Channel", caster);

        if (interrupted) {
            StopSoundOn("Hero_Kakashi.Kamui.Channel", this.target!);
            return;
        }

        this.target?.AddNewModifier(caster, this, "modifier_kakashi_kamui_banish", {duration: this.GetSpecialValueFor("banish_duration")});
        EmitSoundOn("Hero_Kakashi.Kamui.Banish", this.target!);
    }
}

@registerModifier()
export class modifier_kakashi_kamui extends BaseModifier
{
    initial_slow?: number;
    max_slow?: number;
    duration?: number;

    /****************************************/

    IsPurgable(): boolean       {return false}
    RemoveOnDeath(): boolean    {return true}

    /****************************************/

    OnCreated(params: Object): void {
        let ability = this.GetAbility()!;

        this.initial_slow = -ability.GetSpecialValueFor("initial_slow");
        this.max_slow = -ability.GetSpecialValueFor("max_slow");
        this.duration = ability.GetChannelTime();
    }

    /****************************************/

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {[ModifierState.PROVIDES_VISION]: true};
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.MOVESPEED_BONUS_PERCENTAGE,
    ]}


    /****************************************/
    
    GetModifierMoveSpeedBonus_Percentage(): number {
        return math.min(this.initial_slow!, this.max_slow! * ((this.duration! - this.GetRemainingTime()) / this.duration!));
    }

    /****************************************/

    GetEffectName(): string {
        return "particles/units/heroes/hero_void_spirit/void_spirit_disruption_refract.vpcf";
    }

    /****************************************/

    GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.ABSORIGIN_FOLLOW;
    }
}

@registerModifier()
export class modifier_kakashi_kamui_banish extends BaseModifier
{
    break_duration?: number;
    max_health_damage?: number;

    /****************************************/

    IsPurgable(): boolean   {return false}

    /****************************************/

    OnCreated(params: object): void {
        if (!IsServer()) return;
        let ability = this.GetAbility();
        let parent = this.GetParent();
        
        this.break_duration = ability?.GetSpecialValueFor("break_duration");
        this.max_health_damage = ability?.GetSpecialValueFor("max_health_damage");

        parent.Purge(true, false, false, false, true);
        parent.AddNoDraw();

        let banish_fx = ParticleManager.CreateParticle("particles/units/heroes/hero_void_spirit/void_spirit_disruption_refract.vpcf", ParticleAttachment.WORLDORIGIN, undefined);
        ParticleManager.SetParticleControl(banish_fx, 0, parent.GetAbsOrigin());
        this.AddParticle(banish_fx, false, false, -1, false, false);

        let overhead_fx = ParticleManager.CreateParticle("particles/customgames/capturepoints/cp_wind_captured.vpcf", ParticleAttachment.WORLDORIGIN, undefined);
        ParticleManager.SetParticleControl(overhead_fx, 0, parent.GetAbsOrigin());
        this.AddParticle(overhead_fx, false, false, -1, false, false);
    }

    OnDestroy(): void {
        if (!IsServer()) return;
        let parent = this.GetParent();
        let caster = this.GetCaster();
        let ability = this.GetAbility();

        parent.RemoveNoDraw();
        
        parent.AddNewModifier(caster, ability, "modifier_kakashi_kamui_break", {duration: this.break_duration! * (1 - parent.GetStatusResistance())});

        ApplyDamage({
            attacker: caster as CDOTA_BaseNPC,
            victim: parent,
            damage: this.max_health_damage! * parent.GetMaxHealth() / 100,
            damage_type: ability?.GetAbilityDamageType() as DamageTypes,
            damage_flags: DamageFlag.BYPASSES_INVULNERABILITY,
            ability: ability
        })

        ParticleManager.ReleaseParticleIndex(
            ParticleManager.CreateParticle("particles/units/heroes/hero_primal_beast/primal_beast_pulverize_hit_screenshake.vpcf", ParticleAttachment.ABSORIGIN, parent)
        );

        EmitSoundOn("Hero_Kakashi.Kamui.Damage", parent);
    }

    /****************************************/

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.OUT_OF_GAME]: true,
            [ModifierState.NO_UNIT_COLLISION]: true,
            [ModifierState.INVULNERABLE]: true,
            [ModifierState.STUNNED]: true,
            [ModifierState.SILENCED]: true,
        };
    }
}

@registerModifier()
export class modifier_kakashi_kamui_break extends BaseModifier
{
    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.PASSIVES_DISABLED]: true,
        };
    }

    /****************************************/

    GetEffectName(): string {
        return "particles/generic_gameplay/generic_break.vpcf";
    }

    /****************************************/

    GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.OVERHEAD_FOLLOW;
    }
}

// Hidden modifier to allow lightning release casting without interruption
@registerModifier()
export class modifier_kakashi_kamui_channeling extends BaseModifier
{
    IsHidden(): boolean     {return true}
    IsPurgable(): boolean   {return false}
}