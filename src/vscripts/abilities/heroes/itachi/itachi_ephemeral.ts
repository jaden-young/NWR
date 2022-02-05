import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter";

@registerAbility()
class itachi_ephemeral extends BaseAbility {
    SpecialValues: AbilitySpecials = {
        cooldown: {
            value: [12, 11, 10, 9],
            LinkedSpecialBonus: "special_bonus_itachi_1"
        },
        silence_duration: {
            value: [1.5, 2.0, 2.5, 3.0],
            LinkedSpecialBonus: "special_bonus_itachi_4"
        },
        cast_range: [675, 750, 825, 900],
        silence_radius: 300,
        mana_cost: 90,
    };
    BaseProperties: AbilityBaseProperties = {
        Behavior: [AbilityBehavior.AOE, AbilityBehavior.ROOT_DISABLES, AbilityBehavior.DONT_RESUME_MOVEMENT],
        ManaCost: "mana_cost",
        Cooldown: "cooldown",
        CastRange: "cast_range",
    };

    Precache(context: CScriptPrecacheContext): void {
        PrecacheResource("soundfile", "soundevents/itachi_crows.vsndevts", context);
        PrecacheResource("particle", "particles/world_creature_fx/crows.vpcf", context);
    }

    GetCooldown(level: number): number {
        let cooldown = this.GetLevelSpecialValueFor("cooldown", level - 1);
        if (IsServer()) {
            const talent = this.GetCaster().FindTalentValue("itachi_special_bonus_1", "value");
            // assume negative value
            cooldown += talent;
        }
        return cooldown;
    }

    ProcsMagicStick(): boolean {
        return true;
    }

    GetAOERadius(): number {
        return 300;
    }

    OnSpellStart(): void {
        if (!IsServer()) return;
        print("ephemeral start");
        const caster = this.GetCaster();
        const point = this.GetCursorPosition();
        const origin = caster.GetOrigin();
        const maxRange = this.GetSpecialValueFor("cast_range");
        const duration = this.GetSpecialValueFor("silence_duration") + caster.FindTalentValue("special_bonus_itachi_4");

        let direction = (point - origin) as Vector;
        if (direction.Length2D() > maxRange) {
            direction = (direction.Normalized() * maxRange) as Vector;
        }

        FindClearSpaceForUnit(caster, (origin + direction) as Vector, true);
        ProjectileManager.ProjectileDodge(this.GetCaster());
        //TODO: crow effect on origCasterPos

        const enemies = FindUnitsInRadius(
            this.GetCaster().GetTeamNumber(),
            this.GetCaster().GetOrigin(),
            undefined,
            this.GetSpecialValueFor("silence_radius"),
            UnitTargetTeam.ENEMY,
            UnitTargetType.HERO + UnitTargetType.BASIC,
            UnitTargetFlags.MAGIC_IMMUNE_ENEMIES,
            0,
            false
        )
        for (const e of enemies) {
            e.AddNewModifier(
                this.GetCaster(),
                this,
                "modifier_generic_silenced_lua",
                { duration }
            );
        }
    }

}
