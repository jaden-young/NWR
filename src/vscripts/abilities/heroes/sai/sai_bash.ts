import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"


@registerAbility()
export class sai_bash extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return "modifier_sai_bash"
    }
}

@registerModifier()
export class modifier_sai_bash extends BaseModifier
{
    bash_chance?: number;
    bash_damage?: number;
    bash_duration?: number;
    is_bash?: boolean;

    /****************************************/
    
    IsHidden(): boolean         {return true}
    IsPurgable(): boolean       {return false}
    RemoveOnDeath(): boolean    {return false}

    /****************************************/

    OnCreated(params: object): void {
        let ability = this.GetAbility()!;

        this.bash_chance = ability.GetSpecialValueFor("bash_chance");
        this.bash_damage = ability.GetSpecialValueFor("bash_damage");
        this.bash_duration = ability.GetSpecialValueFor("bash_duration");
    }

    /****************************************/

    OnRefresh(params: object): void {
        this.OnCreated(params);
    }


    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.PROCATTACK_BONUS_DAMAGE_PHYSICAL
    ]}

    /****************************************/

    GetModifierProcAttack_BonusDamage_Physical(event: ModifierAttackEvent): number {
        if (!IsServer()) return 0;

        let attacker = event.attacker;
        let target = event.target;
        let ability = this.GetAbility();

        if (!attacker || !target || !ability || !RollPseudoRandomPercentage(this.bash_chance!, PseudoRandom.CUSTOM_GAME_1, attacker)) return 0;

        target.AddNewModifier(attacker, ability, "modifier_bashed", {duration: this.bash_duration! * (1 - target.GetStatusResistance())});
        EmitSoundOn("Hero_Sai.Summons.Bash", target);
        
        return this.bash_damage! + attacker.FindTalentValue("special_bonus_sai_5");
    }
}