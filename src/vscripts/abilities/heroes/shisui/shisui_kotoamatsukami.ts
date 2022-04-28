import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class shisui_kotoamatsukami extends BaseAbility {

    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle",  "particles/units/heroes/shisui/shisui_kotoamatsukami.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/shisui/game_sounds_shisui.vsndevts", context);
        PrecacheResource("soundfile", "soundevents/heroes/shisui/game_sounds_vo_shisui.vsndevts", context);
    }

    /****************************************/

    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return this.GetSpecialValueFor("radius");
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();

        caster.AddNewModifier(caster, this, "modifier_shisui_kotoamatsukami", {duration: this.GetSpecialValueFor("buff_duration")});

        if (caster.HasTalent("special_bonus_shisui_4")) {
            caster.AddNewModifier(caster, this, "modifier_shisui_kotoamatsukami_invisibility", {duration: this.GetSpecialValueFor("buff_duration")});
            EmitSoundOn("DOTA_Item.InvisibilitySword.Activate", caster);
        }

        EmitSoundOn("VO_Hero_Shisui.Kobo.Cast", caster);
    }
}

@registerModifier()
export class modifier_shisui_kotoamatsukami extends BaseModifier
{
    radius?: number;
    hypno_duration?: number;

    /****************************************/

    IsPurgable(): boolean       {return false}
    RemoveOnDeath(): boolean    {return true}

    /****************************************/

    OnCreated(params: Object): void {
        let ability = this.GetAbility()!;

        this.radius = ability.GetSpecialValueFor("radius");
        this.hypno_duration = ability.GetSpecialValueFor("hypno_duration");
    }

    OnDestroy(): void {
        if (!IsServer()) return;
        let caster = this.GetCaster() as CDOTA_BaseNPC;
        let ability = this.GetAbility();

        let enemies = FindUnitsInRadius(
            caster.GetTeamNumber(),
            caster.GetAbsOrigin(),
            undefined,
            this.radius!,
            ability!.GetAbilityTargetTeam(),
            ability!.GetAbilityTargetType(),
            UnitTargetFlags.NONE,
            FindOrder.ANY,
            false
        );

        enemies.forEach(enemy => {
            enemy.AddNewModifier(caster, ability, "modifier_shisui_kotoamatsukami_debuff", {duration: this.hypno_duration});
        });

        EmitSoundOn("Hero_Shisui.Kotoamatsukami.Trigger", caster);
        EmitSoundOn("VO_Hero_Shisui.Kobo.Fire", caster);
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.MOVESPEED_ABSOLUTE_MIN
    ]}

    /****************************************/
    
    GetModifierMoveSpeed_AbsoluteMin(): number {
        return 550;
    }

    
}

@registerModifier()
export class modifier_shisui_kotoamatsukami_invisibility extends BaseModifier
{
    IsPurgable(): boolean       {return false}
    RemoveOnDeath(): boolean    {return true}

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.INVISIBILITY_LEVEL,
        ModifierFunction.ON_ATTACK_LANDED,
        ModifierFunction.ON_ABILITY_EXECUTED
    ]}

    /****************************************/

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.INVISIBLE]: true,
            [ModifierState.NO_UNIT_COLLISION]: true
        };
    }

    /****************************************/

    GetModifierInvisibilityLevel(): number {
        return 1
    }

    /****************************************/

    OnAttackLanded(event: ModifierAttackEvent): void {
        if (!IsServer()) return;
        
        if (event.attacker != this.GetParent()) return;

        this.Destroy();
    }

    /****************************************/
    
    OnAbilityExecuted(event: ModifierAbilityEvent): void {
        if (!IsServer()) return;

        if (event.unit != this.GetParent()) return;

        this.Destroy();
    }
}

@registerModifier()
export class modifier_shisui_kotoamatsukami_debuff extends BaseModifier
{
    IsPurgable(): boolean       {return false}
    IsPurgeException(): boolean {return true}

    /****************************************/

    OnCreated(params: object): void {
        if (!IsServer()) return;
        let parent = this.GetParent();
        let caster = this.GetCaster() as CDOTA_BaseNPC;

        EmitSoundOn("Hero_Shisui.Kotoamatsukami.Target", parent);

        
        parent.MoveToNPC(caster);

        let gaze_fx = ParticleManager.CreateParticle("particles/units/heroes/shisui/shisui_kotoamatsukami.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, parent)
        ParticleManager.SetParticleControlEnt(gaze_fx, 1, parent, ParticleAttachment.ABSORIGIN_FOLLOW, "attach_hitloc", parent.GetAbsOrigin(), true)
        ParticleManager.SetParticleControlEnt(gaze_fx, 2, caster, ParticleAttachment.POINT_FOLLOW, "attach_eye_right", caster.GetAbsOrigin(), true)
        ParticleManager.SetParticleControlEnt(gaze_fx, 3, caster, ParticleAttachment.ABSORIGIN_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true)
        ParticleManager.SetParticleControlEnt(gaze_fx, 10, caster, ParticleAttachment.ABSORIGIN_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true)
        this.AddParticle(gaze_fx, false, false, -1, false, false)
    }

    /****************************************/

    OnDestroy(): void {
        if (!IsServer()) return;
        this.GetParent().Stop();
    }

    /****************************************/

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.COMMAND_RESTRICTED]: true,
            [ModifierState.FEARED]: true
        };
    }
}