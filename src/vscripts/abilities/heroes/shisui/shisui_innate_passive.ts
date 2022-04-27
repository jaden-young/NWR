import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class shisui_innate_passive extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return "modifier_shisui_innate_passive"
    }

    /****************************************/

    Spawn(): void {
        if (IsServer()) {
            this.SetLevel(1);
        }
    }

    /****************************************/

    GetCooldown(level: number): number {
        return super.GetCooldown(level) - (this.GetCaster().GetLevel() - 1) * this.GetSpecialValueFor("cd_reduction_lvl");
    }
}

@registerModifier()
export class modifier_shisui_innate_passive extends BaseModifier
{
    action_cd_reduction?: number;

    /****************************************/
    
    IsHidden(): boolean         {return true}
    IsPurgable(): boolean       {return false}
    RemoveOnDeath(): boolean    {return false}

    /****************************************/

    OnCreated(params: object): void {
        let ability = this.GetAbility()!;

        this.action_cd_reduction = ability.GetSpecialValueFor("action_cd_reduction");
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.INCOMING_DAMAGE_PERCENTAGE,
        ModifierFunction.ON_ABILITY_EXECUTED,
        ModifierFunction.PROCATTACK_FEEDBACK
    ]}

    /****************************************/

    GetModifierIncomingDamage_Percentage(event: ModifierAttackEvent): number {
        if (!IsServer()) return 0;
        let ability = this.GetAbility();
        
        if (this.GetParent().PassivesDisabled() || !ability!.IsCooldownReady()) return 0
        
        ability?.UseResources(true, false, true);

        return -100
    }

    /****************************************/

    OnAbilityExecuted(event: ModifierAbilityEvent): void {
        if (!IsServer()) return
        let unit = event.unit;
        let ability = this.GetAbility() as CDOTABaseAbility;

        if (unit != this.GetParent() || ability.IsCooldownReady()) return;

        let cd = ability.GetCooldownTimeRemaining();
        ability.EndCooldown()
        ability.StartCooldown(cd - this.action_cd_reduction!);
    }

    /****************************************/

    GetModifierProcAttack_Feedback(event: ModifierAttackEvent): number {
        if (!IsServer()) return 0;
        
        this.CheckBodyFlicker()
        this.CheckHaloDance();;

        return 0;
    }

    /****************************************/

    CheckBodyFlicker(): void {
        let ability = this.GetAbility() as CDOTABaseAbility;

        if (ability.IsCooldownReady()) return;

        let cd = ability.GetCooldownTimeRemaining();
        ability.EndCooldown()
        ability.StartCooldown(cd - this.action_cd_reduction!);
    }

    /****************************************/

    CheckHaloDance(): void {
        let parent = this.GetParent()
        if (parent.HasTalent("special_bonus_shisui_6")) {
            let halo_dance = parent.FindAbilityByName("shisui_halo_dance")
            if (!halo_dance || halo_dance.IsCooldownReady()) return;

            let cd = halo_dance.GetCooldownTimeRemaining();
            halo_dance.EndCooldown()
            halo_dance.StartCooldown(cd - parent.FindTalentValue("special_bonus_shisui_6"));
        }
    }
}