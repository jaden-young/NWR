import { BaseAbility, BaseModifier, BaseModifierMotionHorizontal, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

interface kv {
	x: number;
    y: number;
    z: number;
}

@registerAbility()
export class hidan_taunt extends BaseAbility
{
    lightning_blade_fx?: ParticleID;
    active_target?: CDOTA_BaseNPC;

    /****************************************/

    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle", "particles/units/heroes/hero_axe/axe_beserkers_call_owner.vpcf", context);
        PrecacheResource("particle", "particles/status_fx/status_effect_beserkers_call.vpcf", context);
        PrecacheResource("particle", "particles/units/heroes/hidan/hidan_taunt_shard.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/hidan/game_sounds_hidan.vsndevts", context);
        PrecacheResource("soundfile", "soundevents/heroes/hidan/game_sounds_vo_hidan.vsndevts", context);
    }

    /****************************************/

    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return this.GetSpecialValueFor("radius") + this.GetCaster().FindTalentValue("special_bonus_hidan_1");
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();
        let radius = this.GetSpecialValueFor("radius") + caster.FindTalentValue("special_bonus_hidan_1");
        let duration = this.GetSpecialValueFor("duration");

        let enemies = FindUnitsInRadius(
            caster.GetTeamNumber(),
            caster.GetAbsOrigin(),
            undefined,
            radius,
            UnitTargetTeam.ENEMY,
            UnitTargetType.BASIC + UnitTargetType.HERO,
            UnitTargetFlags.MAGIC_IMMUNE_ENEMIES,
            FindOrder.ANY,
            false
        );
        
        enemies.forEach(enemy => {
            enemy.AddNewModifier(caster, this, "modifier_hidan_taunt", {duration: duration * (1 - enemy.GetStatusResistance())});
        });

        caster.AddNewModifier(caster, this, "modifier_hidan_taunt_buff", {duration: this.GetSpecialValueFor("str_duration")});

        EmitSoundOn("VO_Hero_Hidan.Taunt.Cast", caster);
        EmitSoundOn("Hero_Hidan.Taunt.Cast", caster);

        ParticleManager.ReleaseParticleIndex(
            ParticleManager.CreateParticle("particles/units/heroes/hero_axe/axe_beserkers_call_owner.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, caster)
        )

        if (caster.HasShard()) caster.AddNewModifier(caster, this, "modifier_hidan_taunt_shard", {duration: this.GetSpecialValueFor("shard_duration")});
    }
}

@registerModifier()
export class modifier_hidan_taunt extends BaseModifierMotionHorizontal
{
    IsPurgable(): boolean {return false}

    /****************************************/

    OnCreated(params: object): void {
        if (!IsServer()) return;
        ExecuteOrderFromTable({
            OrderType: UnitOrder.ATTACK_TARGET,
            UnitIndex: this.GetParent().entindex(),
            TargetIndex: this.GetCaster()?.entindex(),
            Queue: false
        })

        this.GetParent().SetForceAttackTarget(this.GetCaster());
        this.StartIntervalThink(0.1)
    }

    /****************************************/

    OnIntervalThink(): void {
        let caster = this.GetCaster()!;
        if (!caster.IsAlive() || (caster.GetAbsOrigin() - this.GetParent().GetAbsOrigin() as Vector).Length2D() > 2000) {
            this.Destroy();
        }
    }

    /****************************************/

    OnDestroy(): void {
        if (!IsServer()) return;
        this.GetParent().SetForceAttackTarget(undefined);
    }

    /****************************************/

    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_beserkers_call.vpcf";
    }

    /****************************************/

    StatusEffectPriority(): ModifierPriority {
        return ModifierPriority.HIGH;
    }
}

@registerModifier()
export class modifier_hidan_taunt_buff extends BaseModifierMotionHorizontal
{
    str_gain_hero?: number;
    str_gain_not_hero?: number;
    str_duration?: number;

    /****************************************/

    IsPurgable(): boolean {return false}

    /****************************************/

    OnCreated(params: kv): void {
        let ability = this.GetAbility()!;

        this.str_gain_hero = ability.GetSpecialValueFor("str_gain_hero");
        this.str_gain_not_hero = ability.GetSpecialValueFor("str_gain_not_hero");
        this.str_duration = ability.GetSpecialValueFor("str_duration");
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.ON_ATTACK_LANDED,
        ModifierFunction.STATS_STRENGTH_BONUS
    ]}

    /****************************************/

    OnAttackLanded(event: ModifierAttackEvent): void {
        if (!IsServer()) return;
        let attacker = event.attacker;
        let target = event.target;

        if (target != this.GetParent()) return;

        this.SetStackCount(this.GetStackCount() + (attacker.IsHero() ? this.str_gain_hero! : this.str_gain_not_hero!));
        (target as CDOTA_BaseNPC_Hero).CalculateStatBonus(true);
    }

    /****************************************/

    GetModifierBonusStats_Strength(): number {
        return this.GetStackCount();
    }
}

@registerModifier()
export class modifier_hidan_taunt_shard extends BaseModifierMotionHorizontal
{
    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.MIN_HEALTH
    ]}

    /****************************************/

    GetMinHealth(): number {
        return 1;
    }

    /****************************************/

    GetEffectName(): string {
        return "particles/units/heroes/hidan/hidan_taunt_shard.vpcf";
    }

    /****************************************/

    GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.ABSORIGIN_FOLLOW;
    }
}