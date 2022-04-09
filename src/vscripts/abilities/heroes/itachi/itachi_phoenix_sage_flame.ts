import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class itachi_phoenix_sage_flame extends BaseAbility
{
    target?: CDOTA_BaseNPC_Hero;

    /****************************************/

    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle", "particles/units/heroes/itachi/itachi_phoenix_sage_flame.vpcf", context);
        PrecacheResource("particle", "particles/units/heroes/itachi/itachi_phoenix_sage_flame_layer.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/itachi/game_sounds_vo_itachi.vsndevts", context);
        PrecacheResource("soundfile", "soundevents/heroes/itachi/game_sounds_itachi.vsndevts", context);
        //PrecacheResource("soundfile", "soundevents/heroes/kakashi/game_sounds_vo_kakashi.vsndevts", context);
    }

    /****************************************/

    OnAbilityPhaseStart(): boolean {
        EmitSoundOn("VO_Hero_Itachi.PhoenixSageFlame.Talk", this.GetCaster());
        return true
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();
        this.FireProjectile(this.GetCursorPosition(), this.GetSpecialValueFor("projectile_count"));
        EmitSoundOn("Hero_Itachi.PhoenixSageFlame.Cast", this.GetCaster());

        let layer_fx = ParticleManager.CreateParticle("particles/units/heroes/itachi/itachi_phoenix_sage_flame_layer.vpcf", ParticleAttachment.ABSORIGIN, caster);
        ParticleManager.SetParticleControlEnt(layer_fx, 1, caster, ParticleAttachment.ABSORIGIN, "", Vector(0, 0, 0), false);
        ParticleManager.ReleaseParticleIndex(layer_fx);
    }

    /****************************************/

    FireProjectile(position: Vector, count: number): void {
        let caster = this.GetCaster();
        let direction = position - caster.GetAbsOrigin() as Vector;
        direction.z = 0;
        direction = direction.Normalized();


        ProjectileManager.CreateLinearProjectile({
            Ability: this,
            EffectName: "particles/units/heroes/itachi/itachi_phoenix_sage_flame.vpcf",
            vSpawnOrigin: caster.GetAbsOrigin() + Vector(0, 0, 100) as Vector,
            fDistance: this.GetCastRange(caster.GetAbsOrigin(), undefined),
            fStartRadius: this.GetSpecialValueFor("start_radius"),
            fEndRadius: this.GetSpecialValueFor("end_radius"),
            Source: caster,
            iUnitTargetTeam: UnitTargetTeam.ENEMY,
		    iUnitTargetType: UnitTargetType.HERO + UnitTargetType.BASIC,
            vVelocity: direction * this.GetSpecialValueFor("speed") as Vector,
        })

        count--;
        if (count > 0) 
            Timers.CreateTimer(this.GetSpecialValueFor("fire_rate"), () => this.FireProjectile(position, count));
    }

    /****************************************/

    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (!target) return true;
        let max_hits = this.GetSpecialValueFor("max_hits");
        let duration = this.GetSpecialValueFor("duration");

        let modifier = target.FindModifierByName("modifier_itachi_phoenix_sage_flame");
        if (modifier && modifier.GetStackCount() >= max_hits) return false;

        target.AddNewModifier(this.GetCaster(), this, "modifier_itachi_phoenix_sage_flame", {duration: duration});
        EmitSoundOn("Hero_Itachi.PhoenixSageFlame.Hit", target);
    }
}

@registerModifier()
export class modifier_itachi_phoenix_sage_flame extends BaseModifier
{
    magic_res_reduction?: number;
    move_slow?: number;
    max_hits?: number;

    damage_table?: ApplyDamageOptions;

    /****************************************/

    OnCreated(params: Object): void {
        let ability = this.GetAbility()!;

        let damage = ability.GetSpecialValueFor("damage_per_proj");
        this.magic_res_reduction = -ability.GetSpecialValueFor("magic_res_reduction") - this.GetCaster()!.FindTalentValue("special_bonus_itachi_1");
        this.move_slow = -ability.GetSpecialValueFor("move_slow");
        this.max_hits = ability.GetSpecialValueFor("max_hits");

        if (!IsServer()) return;
        this.SetStackCount(1);
        
        this.damage_table = {
            attacker: this.GetCaster() as CDOTA_BaseNPC,
            victim: this.GetParent(),
            damage: damage,
            damage_type: ability.GetAbilityDamageType(),
            ability: ability
        }

        ApplyDamage(this.damage_table);
    }

    /****************************************/

    OnRefresh(params: object): void {
        if (!IsServer()) return;

        ApplyDamage(this.damage_table!);
        this.IncrementStackCount();
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.MOVESPEED_BONUS_PERCENTAGE,
        ModifierFunction.MAGICAL_RESISTANCE_BONUS
    ]}


    /****************************************/
    
    GetModifierMoveSpeedBonus_Percentage(): number {
        return this.move_slow! * this.GetStackCount();
    }

    /****************************************/

    GetModifierMagicalResistanceBonus(): number {
        return this.magic_res_reduction! * this.GetStackCount();
    }

    /****************************************/

    GetEffectName(): string {
        return "particles/econ/events/ti10/hot_potato/hot_potato_debuff.vpcf";
    }

    /****************************************/

    GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.ABSORIGIN_FOLLOW;
    }
}