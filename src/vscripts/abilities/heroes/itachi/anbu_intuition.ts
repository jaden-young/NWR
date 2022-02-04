import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter";

@registerAbility()
export class itachi_anbu_intuition extends BaseAbility {
    OnOwnerSpawned(): void {
        if (!IsServer()) return;
        this.SetLevel(1);
    }

    OnHeroLevelUp(): void {
        if (!IsServer()) return;
        this.SetLevel(this.GetLevel() + 1);
    }

    OnSpellStart() {
        if (!IsServer()) return;
        const caster = this.GetCaster();
        const duration = this.GetSpecialValueFor("duration")!;
        caster.AddNewModifier(caster, this, modifier_itachi_anbu_intuition.name, { duration: duration });
    }
}


@registerModifier()
export class modifier_itachi_anbu_intuition extends BaseModifier {
    dodgeChanceKey = "dodge_chance";
    dodgeChance?: number;

    OnCreated(params: object): void {
        this.dodgeChance = this.GetAbility()?.GetSpecialValueFor(this.dodgeChanceKey);
    }

    OnRefresh(params: object): void {
        this.dodgeChance = this.GetAbility()?.GetSpecialValueFor(this.dodgeChanceKey);
    }

    OnHeroKilled(event: ModifierAttackEvent) {
        if (!IsServer()) return;
        if (event.attacker == this.GetCaster()) {
            this.GetAbility()?.EndCooldown();
        }
    }

    GetModifierDodgeProjectile() {
        // 0 is false in lua. This func expects 0 | 1 as return, not TS bool
        if (this.GetParent().PassivesDisabled()) {
            return 1;
        }
        return RollPercentage(this.dodgeChance!) ? 0 : 1;
    }
}
