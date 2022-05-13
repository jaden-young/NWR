import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class raikage_innate_passive extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return "modifier_raikage_innate_passive"
    }

    /****************************************/

    Spawn(): void {
        if (IsServer()) {
            this.SetLevel(1);
        }
    }
}

@registerModifier()
export class modifier_raikage_innate_passive extends BaseModifier
{
	parent: CDOTA_BaseNPC = this.GetParent();
    distance_per_charge?: number;
    charge_per_distance?: number;
    max_charges?: number;
    attack_min_charges?: number;
    added_charges_threshold?: number;
    added_charges?: number;
    crit_per_stack?: number;
    crit_per_stack_lvl?: number;

    current_crit?: number;
    current_distance: number = 0;
    last_pos?: Vector

    /****************************************/

    IsHidden(): boolean         {return this.GetStackCount() == 0}
    IsPurgable(): boolean       {return false}
    RemoveOnDeath(): boolean    {return false}

    /****************************************/

    OnCreated(params: object): void {

        let ability = this.GetAbility()!;
        this.distance_per_charge = ability.GetSpecialValueFor("distance_per_charge");
        this.charge_per_distance = ability.GetSpecialValueFor("charge_per_distance");
        this.max_charges = ability.GetSpecialValueFor("max_charges");
        this.attack_min_charges = ability.GetSpecialValueFor("attack_min_charges");
        this.added_charges_threshold = ability.GetSpecialValueFor("added_charges_threshold");
        this.added_charges = ability.GetSpecialValueFor("added_charges");
        this.crit_per_stack = ability.GetSpecialValueFor("crit_per_stack");
        this.crit_per_stack_lvl = ability.GetSpecialValueFor("crit_per_stack_lvl");

        this.current_crit = this.crit_per_stack;

        this.StartIntervalThink(0.1);
    }
    
    /****************************************/

    OnIntervalThink(): void {
        this.current_crit = this.crit_per_stack! + (this.crit_per_stack_lvl! * (this.GetParent().GetLevel() - 1))
        if (!IsServer()) return;

        if (!this.last_pos) this.last_pos = this.GetParent().GetAbsOrigin();

        let parent = this.GetParent();
        let origin = parent.GetAbsOrigin();

        this.current_distance += (origin - this.last_pos! as Vector).Length2D();
        this.last_pos = origin;

        if (this.current_distance >= this.distance_per_charge!) {
            let stacks = math.floor(this.current_distance / this.distance_per_charge! + 0.5)
            this.current_distance = this.current_distance % this.distance_per_charge!;
            this.SetStackCount(math.min(this.GetStackCount() + stacks, this.max_charges!));
        }
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.PREATTACK_CRITICALSTRIKE,
        ModifierFunction.ON_ATTACK_LANDED,
        ModifierFunction.TOOLTIP
    ]}

    /****************************************/

    GetModifierPreAttack_CriticalStrike(event: ModifierAttackEvent): number {
        if (!IsServer()) return 0;
        let attacker = event.attacker as CDOTA_BaseNPC_Hero;
        let target = event.target;
        let ability = this.GetAbility();

        if (attacker != this.GetParent() || !target || !ability || target.IsBuilding() || target.IsOther()) return 0;

        if (this.GetStackCount() < this.attack_min_charges!) return 0;

        return 100 + this.GetStackCount() * (this.crit_per_stack! + (this.crit_per_stack_lvl! * (attacker.GetLevel() - 1)));
    }

    /****************************************/

    OnAttackLanded(event: ModifierAttackEvent): void {
        if (!IsServer()) return;
        let attacker = event.attacker as CDOTA_BaseNPC_Hero;
        let target = event.target;
        let ability = this.GetAbility();

        if (attacker != this.GetParent() || !target || !ability || target.IsBuilding() || target.IsOther()) return;

        if (this.GetStackCount() < this.added_charges_threshold!) {
            this.SetStackCount(this.GetStackCount() + this.added_charges!);
        } else {
            this.SetStackCount(0);
        }
    }

    /****************************************/

    OnTooltip(): number {
        return 100 + this.current_crit! * this.GetStackCount();
    }
}