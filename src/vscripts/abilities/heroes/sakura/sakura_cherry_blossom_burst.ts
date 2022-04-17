import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

interface SakuraInnate extends CDOTA_Buff
{
    CanProc(): boolean;
    ProcEnhancedStrength(target: CDOTA_BaseNPC, reset: boolean): void;
}

interface extra 
{
    proc_passive?: number;
}

@registerAbility()
export class sakura_cherry_blossom_burst extends BaseAbility {

    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle",  "particles/units/heroes/sakura/sakura_cherry_blossom_burst.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/sakura/game_sounds_sakura.vsndevts", context);
        //PrecacheResource("soundfile", "soundevents/heroes/sakura/game_sounds_vo_sakura.vsndevts", context);
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();
        let position = this.GetCursorPosition();
        let radius = this.GetSpecialValueFor("radius");
        let speed = this.GetSpecialValueFor("speed");
        let innate = caster.FindAbilityByName("sakura_innate_passive");
        let modifier = undefined;
        let proc = false;

        if (innate) modifier = caster.FindModifierByName(innate.GetIntrinsicModifierName()) as SakuraInnate;

        proc = modifier ? modifier!.CanProc() : false;


        let direction = position - caster.GetAbsOrigin() as Vector;
        direction.z = 0;
        direction = direction.Normalized();

        ProjectileManager.CreateLinearProjectile({
            Ability: this,
            EffectName: "particles/units/heroes/sakura/sakura_cherry_blossom_burst.vpcf",
            vSpawnOrigin: caster.GetAttachmentOrigin(caster.ScriptLookupAttachment("attach_right_hand")) as Vector,
            fDistance: this.GetEffectiveCastRange(position, caster),
            Source: caster,
            fStartRadius: radius,
            fEndRadius: radius,
            iUnitTargetTeam: UnitTargetTeam.ENEMY,
            iUnitTargetType: UnitTargetType.BASIC + UnitTargetType.HERO,
            iUnitTargetFlags: UnitTargetFlags.NONE,
            vVelocity: direction * speed as Vector,
            ExtraData: {
                proc_passive: proc
            }
        });

        if (proc) {
            modifier?.SetStackCount(0);
        }

        EmitSoundOn("Hero_Sakura.CherryBlossomBurst.Cast", caster);
    }

    /****************************************/

    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, extraData: extra): boolean | void {
        if (!target || !this || this.IsNull()) return;
        let caster = this.GetCaster();
        let innate_ability = caster.FindAbilityByName("sakura_innate_passive")!;

        let damage_table : ApplyDamageOptions = {
            attacker: caster,
            victim: target,
            damage: this.GetSpecialValueFor("damage"),
            damage_type: this.GetAbilityDamageType(),
            ability: this
        }

        ApplyDamage(damage_table);
        target.AddNewModifier(caster, this, "modifier_sakura_cherry_blossom_burst", {duration: this.GetSpecialValueFor("slow_duration") * (1 - target.GetStatusResistance())});

        if (extraData.proc_passive == 1 && innate_ability) {
            let modifier = caster.FindModifierByName(innate_ability.GetIntrinsicModifierName()) as SakuraInnate;
            modifier.ProcEnhancedStrength(target, false);
        }

        ParticleManager.ReleaseParticleIndex(
            ParticleManager.CreateParticle("particles/econ/items/dazzle/dazzle_ti9/dazzle_shadow_wave_ti9_impact_damage_bits.vpcf", ParticleAttachment.ABSORIGIN, target)
        );

        //EmitSoundOn("", target);
    }
}

@registerModifier()
export class modifier_sakura_cherry_blossom_burst extends BaseModifier
{
    move_slow?: number;

    /****************************************/

    OnCreated(params: object): void {
        this.move_slow = -this.GetAbility()!.GetSpecialValueFor("move_slow");
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
        return "particles/items3_fx/witch_blade_debuff_arcs.vpcf"
    }

    /****************************************/

    GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.ABSORIGIN_FOLLOW
    }

    /****************************************/
}