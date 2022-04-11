import { BaseAbility, BaseModifier, BaseModifierMotionHorizontal, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

interface kv {
	target: EntityIndex;
}

@registerAbility()
export class guy_dynamic_entry extends BaseAbility
{
    lightning_blade_fx?: ParticleID;
    active_target?: CDOTA_BaseNPC;

    /****************************************/

    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle", "particles/units/heroes/guy/guy_dynamic_entry_impact_base.vpcf", context);
        PrecacheResource("particle", "particles/units/heroes/guy/guy_dynamic_entry_six_gates_impact_base.vpcf", context);
        PrecacheResource("particle", "particles/units/heroes/guy/guy_dynamic_entry_armor_debuff_base.vpcf", context);
        PrecacheResource("particle", "particles/units/heroes/guy/guy_dynamic_entry_armor_debuff_gates.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/guy/game_sounds_guy.vsndevts", context);
        PrecacheResource("soundfile", "soundevents/heroes/guy/game_sounds_vo_guy.vsndevts", context);
    }

    /****************************************/

    GetAbilityTextureName(): string {
        return (this.GetCaster() && this.GetCaster().HasModifier("modifier_guy_seventh_gate")) ? "guy_dynamic_entry_gates" : "guy_dynamic_entry";
    }

    /****************************************/

    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (this.GetCaster().HasModifier("modifier_guy_seventh_gate"))
            return super.GetCastRange(location, target) + this.GetCaster().FindTalentValue("special_bonus_guy_5") + this.GetSpecialValueFor("castrange_ult_bonus");
        else
            return super.GetCastRange(location, target) + this.GetCaster().FindTalentValue("special_bonus_guy_5");
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();
        let target = this.GetCursorTarget();

        if (target?.TriggerSpellAbsorb(this)) return;

        caster.AddNewModifier(caster, this, "modifier_guy_dynamic_entry", {duration: -1, target: target?.entindex()})
        
        caster.HasModifier("modifier_guy_seventh_gate") ? 
            EmitSoundOn("VO_Hero_Guy.DynamicEntryGate.Cast", caster) : 
            EmitSoundOn("VO_Hero_Guy.DynamicEntry.Cast", caster);
    }
}

@registerModifier()
export class modifier_guy_dynamic_entry extends BaseModifierMotionHorizontal
{
    target?: CDOTA_BaseNPC;

    duration?: number;
    speed?: number;
    damage?: number;
    stop_distance?: number;

    /****************************************/

    IsPurgable(): boolean       {return false}
    RemoveOnDeath(): boolean    {return true}

    /****************************************/

    OnCreated(params: kv): void {
        let ability = this.GetAbility()!;

        this.duration = ability.GetSpecialValueFor("duration");
        this.speed = ability.GetSpecialValueFor("speed");
        this.damage = ability.GetSpecialValueFor("damage");
        this.stop_distance = ability.GetSpecialValueFor("stop_distance");

        if (!IsServer()) return;
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

        parent.RemoveHorizontalMotionController(this);

        if (this.target && !this.target.IsNull() && this.target.HasModifier("modifier_guy_dynamic_entry_target")) {
            this.target.RemoveModifierByName("modifier_guy_dynamic_entry_target");
        }
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
        let direction = (this.target!.GetAbsOrigin() - parent.GetAbsOrigin() as Vector).Normalized();

        this.CheckConditions();
        if (this.CheckDistance()) return;

        parent.FaceTowards(this.target!.GetAbsOrigin());
        parent.SetAbsOrigin(parent.GetAbsOrigin() + this.speed! * direction * dt as Vector);
    }

    /****************************************/

    OnHorizontalMotionInterrupted(): void {
        this.Destroy();
    }

    /****************************************/

    GetOverrideAnimation(): GameActivity{
        return GameActivity.DOTA_CHANNEL_ABILITY_1;
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

        if (distance <= 128) {
            let ability = this.GetAbility();

            if (!this.target?.IsMagicImmune()) {
                ApplyDamage({
                    attacker: parent,
                    victim: this.target!,
                    damage: this.damage!,
                    damage_type: this.GetAbility()!.GetAbilityDamageType(),
                    ability: this.GetAbility(),
                })

                this.target?.AddNewModifier(parent, ability, "modifier_guy_dynamic_entry_debuff", {duration: this.duration! * (1 - this.target.GetStatusResistance())})
            }

            this.ShowEffects();

            this.Destroy()
            return true;
        } else if (distance > this.stop_distance!) {
            this.Destroy();
            return true;
        }

        return false;
    }   

    /****************************************/

    ShowEffects() {
        let parent = this.GetParent();
        let gates_open = parent.HasModifier("modifier_guy_seventh_gate");
        let impact_particle = gates_open ? "particles/units/heroes/guy/guy_dynamic_entry_six_gates_impact_base.vpcf" : "particles/units/heroes/guy/guy_dynamic_entry_impact_base.vpcf";

        let impact_fx = ParticleManager.CreateParticle(impact_particle, ParticleAttachment.ABSORIGIN_FOLLOW, this.target);
        ParticleManager.SetParticleControlEnt(impact_fx, 1, this.target!, ParticleAttachment.ABSORIGIN, "attach_hitloc", this.target!.GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(impact_fx, 3, this.target!, ParticleAttachment.ABSORIGIN, "attach_hitloc", this.target!.GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(impact_fx, 6, Vector(150, 1, 1));
        ParticleManager.ReleaseParticleIndex(impact_fx);

        gates_open ? EmitSoundOn("Hero_Guy.DynamicEntryGate.Impact", this.target!) : EmitSoundOn("Hero_Guy.DynamicEntry.Impact", this.target!);
        EmitSoundOn("Hero_Guy.DynamicEntry.ImpactLayer", this.target!);
    }
}

@registerModifier()
export class modifier_guy_dynamic_entry_debuff extends BaseModifier
{
    armor_reduction?: number;
    effect_name: string = "particles/units/heroes/guy/guy_dynamic_entry_armor_debuff_base.vpcf";

    /****************************************/

    OnCreated(params: object): void {
        let ability = this.GetAbility();
        let caster = this.GetCaster();
        let gates_open = caster?.HasModifier("modifier_guy_seventh_gate");

        this.armor_reduction = -ability!.GetSpecialValueFor("armor_reduction");

        if (gates_open) {
            this.armor_reduction -= ability!.GetSpecialValueFor("armor_ult_bonus");
            this.effect_name = "particles/units/heroes/guy/guy_dynamic_entry_armor_debuff_gates.vpcf";
        }
    }

    /****************************************/

    DeclareFunctions(){ return [ModifierFunction.PHYSICAL_ARMOR_BONUS]}

    /****************************************/

    GetModifierPhysicalArmorBonus(): number {
        return this.armor_reduction!;
    }

    /****************************************/

    GetEffectName(): string {
        return this.effect_name;
    }

    /****************************************/

    GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.OVERHEAD_FOLLOW;
    }
}

@registerModifier()
export class modifier_guy_dynamic_entry_target extends BaseModifier
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