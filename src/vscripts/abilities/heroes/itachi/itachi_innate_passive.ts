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
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.ON_ATTACK_LANDED,
    ]}

    /****************************************/

    OnAttackLanded(event: ModifierAttackEvent): void {
        if (!IsServer()) return;
        let attacker = event.attacker as CDOTA_BaseNPC_Hero;
        let target = event.target;
        let ability = this.GetAbility();

        if (!attacker || !target || !ability || attacker != this.parent) return;

        if (!this.IsAttackingFromBehind(target)) return;

        let multiplier = ability.GetSpecialValueFor("damage_per_int") + attacker.FindTalentValue("special_bonus_itachi_5");
        
        this.damage_table!.victim = target;
        this.damage_table!.damage = attacker.GetIntellect() * multiplier;
        ApplyDamage(this.damage_table!);

        SendOverheadEventMessage(undefined, OverheadAlert.BONUS_SPELL_DAMAGE, target, this.damage_table!.damage * (1 + attacker.GetSpellAmplification(false)), undefined);
    }

    /****************************************/

    IsAttackingFromBehind(target: CDOTA_BaseNPC): boolean {
        let direction = (target.GetAbsOrigin() - this.parent.GetAbsOrigin() as Vector).Normalized();
        let target_facing_direction = target.GetForwardVector();

        return target_facing_direction.Dot(direction) > this.angle!;
    }
}