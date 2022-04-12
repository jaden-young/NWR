import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class itachi_innate_passive extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return "modifier_itachi_innate_passive"
    }

    /****************************************/

    Spawn(): void {
        if (IsServer()) {
            this.SetLevel(1);
        }
    }
}

@registerModifier()
export class modifier_itachi_innate_passive extends BaseModifier
{
	parent: CDOTA_BaseNPC = this.GetParent();
    angle?: number;
    damage_table?: ApplyDamageOptions;
    record: number = -1;
    sound: string = "ChakraPunch.Attack";

    /****************************************/

    IsHidden(): boolean         {return true}
    IsPurgable(): boolean       {return false}
    RemoveOnDeath(): boolean    {return false}

    /****************************************/

    OnCreated(params: object): void {
        if (!IsServer()) return;

        let ability = this.GetAbility()!;
        this.angle = ability.GetSpecialValueFor("angle") / 180;

        this.damage_table = {
            attacker: this.GetParent(),
            victim: this.GetParent(),
            damage: 0,
            damage_type: ability.GetAbilityDamageType(),
            ability: ability
        }

        this.StartIntervalThink(0.1);
    }

    /****************************************/

    OnIntervalThink(): void {
        let parent = this.GetParent()
        if (parent.IsMoving() || parent.GetSequence() == "striker_itachi_idle") {
            this.GetParent().FadeGesture(GameActivity.DOTA_ATTACK);
            this.GetParent().FadeGesture(GameActivity.DOTA_ATTACK_EVENT);
        }
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.PRE_ATTACK,
        ModifierFunction.ON_ATTACK_CANCELLED,
        ModifierFunction.ON_ATTACK_RECORD_DESTROY,
        ModifierFunction.ON_ATTACK_LANDED,
        ModifierFunction.TRANSLATE_ATTACK_SOUND
    ]}

    /****************************************/

    GetModifierPreAttack(event: ModifierAttackEvent): number {
        if (!IsServer()) return 0;
        let attacker = event.attacker as CDOTA_BaseNPC_Hero;
        let target = event.target;
        let ability = this.GetAbility();

        if (!attacker || !target || !ability || attacker != this.parent) return 0;

        if (!this.IsAttackingFromBehind(target)) return 0;

        this.record = event.record;

        let play_rate = 1 / attacker.GetSecondsPerAttack();
        attacker.StartGestureWithPlaybackRate(GameActivity.DOTA_ATTACK_EVENT, play_rate * 1.4);
        EmitSoundOn("Hero_Itachi.Kunai.PreAttack", attacker);

        this.sound = "Hero_Itachi.Kunai.Attack";

        return 0;
    }

    OnAttackCancelled(event: ModifierAttackEvent): void {
        if (!IsServer()) return;

        if (event.record == this.record) {
            event.attacker.FadeGesture(GameActivity.DOTA_ATTACK_EVENT);
            StopSoundOn("Hero_Itachi.Kunai.PreAttack", event.attacker);
        }
    }

    /****************************************/

    OnAttackRecordDestroy(event: ModifierAttackEvent): void {
        if (!IsServer()) return;
        if (event.record == this.record) {
            this.record = -1;
            this.sound = "ChakraPunch.Attack";
        }
    }

    /****************************************/

    OnAttackLanded(event: ModifierAttackEvent): void {
        if (!IsServer()) return;
        let attacker = event.attacker as CDOTA_BaseNPC_Hero;
        let target = event.target;
        let ability = this.GetAbility();

        if (this.record != event.record) return;

        let multiplier = ability!.GetSpecialValueFor("damage_per_int") + attacker.FindTalentValue("special_bonus_itachi_5");
        
        this.damage_table!.victim = target;
        this.damage_table!.damage = attacker.GetIntellect() * multiplier;
        ApplyDamage(this.damage_table!);

        let true_damage = math.floor((this.damage_table!.damage * (1 + attacker.GetSpellAmplification(false))) - this.damage_table!.damage * target.GetMagicalArmorValue());

        SendOverheadEventMessage(undefined, OverheadAlert.BONUS_SPELL_DAMAGE, target, true_damage, undefined);

        EmitSoundOn("Hero_Itachi.Anbu.Proc", target);
        let crit_fx = ParticleManager.CreateParticle("particles/units/heroes/hero_phantom_assassin/phantom_assassin_crit_impact.vpcf", ParticleAttachment.CUSTOMORIGIN, undefined);
        ParticleManager.SetParticleControlEnt(crit_fx, 0, target, ParticleAttachment.POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(crit_fx, 1, target.GetAbsOrigin());
        ParticleManager.SetParticleControlForward(crit_fx, 1, -attacker.GetForwardVector() as Vector);
        ParticleManager.ReleaseParticleIndex(crit_fx);
    }

    /****************************************/

    IsAttackingFromBehind(target: CDOTA_BaseNPC): boolean {
        let direction = (target.GetAbsOrigin() - this.parent.GetAbsOrigin() as Vector).Normalized();
        let target_facing_direction = target.GetForwardVector();

        return target_facing_direction.Dot(direction) > this.angle!;
    }

    GetAttackSound(): string {
        return this.sound;
    }
}