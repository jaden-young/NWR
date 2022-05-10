import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class raikage_speed_blitz extends BaseAbility {

    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("soundfile", "soundevents/heroes/raikage/game_sounds_raikage.vsndevts", context);
        //PrecacheResource("soundfile", "soundevents/heroes/raikage/game_sounds_vo_raikage.vsndevts", context);
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();

        caster.AddNewModifier(caster, this, "modifier_raikage_speed_blitz", {duration: this.GetSpecialValueFor("duration")});
        EmitSoundOn("Hero_Raikage.SpeedBlitz.Cast", caster);
    }
}

@registerModifier()
export class modifier_raikage_speed_blitz extends BaseModifier
{
    bonus_damage?: number;
    bonus_move_speed?: number;
    damage_table?: ApplyDamageOptions;
    slow_duration?: number;
    radius?: number;

    /****************************************/

    IsPurgable(): boolean       {return false}
    RemoveOnDeath(): boolean    {return true}

    /****************************************/

    OnCreated(params: Object): void {
        let parent = this.GetParent();
        let ability = this.GetAbility()!;

        this.bonus_damage = ability.GetSpecialValueFor("bonus_damage");
        this.bonus_move_speed = ability.GetSpecialValueFor("bonus_move_speed");
        this.slow_duration = ability.GetSpecialValueFor("slow_duration");
        this.radius = ability.GetSpecialValueFor("radius");

        if (!IsServer()) return;

        let left_hand_fx = ParticleManager.CreateParticle("particles/econ/items/spirit_breaker/spirit_breaker_thundering_flail/spirit_breaker_thundering_flail.vpcf", ParticleAttachment.CUSTOMORIGIN, parent);
        ParticleManager.SetParticleControlEnt(left_hand_fx, 0, parent, ParticleAttachment.POINT_FOLLOW, "attach_lefthand", parent.GetAbsOrigin(), true)
        this.AddParticle(left_hand_fx, false, false, -1, false, false);

        let right_hand_fx = ParticleManager.CreateParticle("particles/econ/items/spirit_breaker/spirit_breaker_thundering_flail/spirit_breaker_thundering_flail.vpcf", ParticleAttachment.CUSTOMORIGIN, parent);
        ParticleManager.SetParticleControlEnt(right_hand_fx, 0, parent, ParticleAttachment.POINT_FOLLOW, "attach_righthand", parent.GetAbsOrigin(), true)
        this.AddParticle(right_hand_fx, false, false, -1, false, false);

        this.damage_table = {
            attacker: parent,
            victim: parent,
            damage: this.bonus_damage,
            damage_type: ability.GetAbilityDamageType(),
            ability: ability
        }
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.MOVESPEED_BONUS_PERCENTAGE,
        ModifierFunction.TRANSLATE_ACTIVITY_MODIFIERS,
        ModifierFunction.ON_ATTACK_LANDED
    ]}

    /****************************************/
    
    GetModifierMoveSpeedBonus_Percentage(): number {
        return this.bonus_move_speed!;
    }

    /****************************************/

    GetActivityTranslationModifiers(): string {
        return "speedblitz";
    }
    
    /****************************************/

    OnAttackLanded(event: ModifierAttackEvent): void {
        if (!IsServer()) return;
        let attacker = event.attacker;
        let target = event.target;
        let ability = this.GetAbility();

        if (attacker != this.GetParent() || !ability || !target) return;

        let enemies = FindUnitsInRadius(
            attacker.GetTeamNumber(),
            target.GetAbsOrigin(),
            undefined,
            this.radius!,
            UnitTargetTeam.ENEMY,
            UnitTargetType.BASIC + UnitTargetType.HERO,
            UnitTargetFlags.NONE,
            FindOrder.ANY,
            false
        );
        
        enemies.forEach(enemy => {
            this.damage_table!.victim = enemy;
            ApplyDamage(this.damage_table!);

            enemy.AddNewModifier(attacker, ability, "modifier_raikage_speed_blitz_debuff", {duration: this.slow_duration! * (1 - enemy.GetStatusResistance())});
        });

        EmitSoundOn("Hero_Raikage.SpeedBlitz.Impact", attacker);

        this.Destroy();
    }
}

@registerModifier()
export class modifier_raikage_speed_blitz_debuff extends BaseModifier
{
    attack_speed_reduction?: number;

    /****************************************/

    OnCreated(params: object): void {
        this.attack_speed_reduction = -this.GetAbility()!.GetSpecialValueFor("attack_speed_reduction");
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.ATTACKSPEED_BONUS_CONSTANT
    ]}

    /****************************************/

    GetModifierAttackSpeedBonus_Constant(): number {
        return this.attack_speed_reduction!;
    }

    /****************************************/

    GetEffectName(): string {
        return "particles/units/heroes/hero_razor/razor_ambient_g.vpcf";
    }

    /****************************************/
    
    GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.ABSORIGIN_FOLLOW;
    }
}