import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

interface SaiInnateModifier extends CDOTA_Buff
{
    UpdateValues(): void;
}

@registerAbility()
export class sai_innate_passive extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return "modifier_sai_innate_passive"
    }

    /****************************************/

    Spawn(): void {
        if (IsServer()) {
            this.SetLevel(1);
        }
    }

    /****************************************/

    OnHeroLevelUp(): void {
        (this.GetCaster().FindModifierByName("modifier_sai_innate_passive") as SaiInnateModifier).UpdateValues()
    }

    /****************************************/

    ApplyDebuff(target: CDOTA_BaseNPC): void {
        target.AddNewModifier(this.GetCaster(), this, "modifier_sai_innate_passive_debuff", {duration: this.GetSpecialValueFor("duration") * (1 - target.GetStatusResistance())});
    }
}

@registerModifier()
export class modifier_sai_innate_passive extends BaseModifier
{
    damage_amp?: number;
    damage_amp_lvl?: number;
    current_damage_amp?: number;

    /****************************************/
    IsPurgable(): boolean       {return false}
    RemoveOnDeath(): boolean    {return false}

    /****************************************/

    OnCreated(params: object): void {
        let ability = this.GetAbility()!;

        this.damage_amp = ability.GetSpecialValueFor("damage_amp");
        this.damage_amp_lvl = ability.GetSpecialValueFor("damage_amp_lvl");
        this.current_damage_amp = this.damage_amp;

        this.SetHasCustomTransmitterData(true);

        if (!IsServer()) return;
        this.StartIntervalThink(1);
    }

    /****************************************/

    OnIntervalThink(): void {
        this.UpdateValues();
    }

    /****************************************/

    AddCustomTransmitterData() {
        return {current_damage_amp: this.current_damage_amp}
    }

    /****************************************/

    HandleCustomTransmitterData(data: any) {
        this.current_damage_amp = data.current_damage_amp;
    }

    /****************************************/

    UpdateValues(): void {
        let parent = this.GetParent();
        let level = parent.GetLevel() - 1;

        this.current_damage_amp = this.damage_amp! + this.damage_amp_lvl! * level;

        this.SendBuffRefreshToClients();
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.TOOLTIP
    ]}

    /****************************************/

    OnTooltip(): number {
        return this.current_damage_amp!;
    }
}

@registerModifier()
export class modifier_sai_innate_passive_debuff extends BaseModifier
{
    damage_amp?: number;

    /****************************************/

    OnCreated(params: object): void {
        let caster = this.GetCaster();
        let ability = this.GetAbility();
        let level = caster!.GetLevel() - 1;

        this.damage_amp = ability!.GetSpecialValueFor("damage_amp") + ability!.GetSpecialValueFor("damage_amp_lvl") * level;
    }

    /****************************************/

    OnRefresh(params: object): void {
        this.OnCreated(params);
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.INCOMING_DAMAGE_PERCENTAGE
    ]}

    /****************************************/

    GetModifierIncomingDamage_Percentage(): number {
        return this.damage_amp!;
    }
}