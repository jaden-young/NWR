import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter";

@registerAbility()
class itachi_ephemeral extends BaseAbility {

    BaseProperties: AbilityBaseProperties = {
        Behavior: [AbilityBehavior.AOE, AbilityBehavior.POINT, AbilityBehavior.ROOT_DISABLES, AbilityBehavior.IMMEDIATE],
        ManaCost: 90,
        // Cooldown: [21, 18, 15, 12], // sync with special
        CastRange: [675, 750, 825, 900] // sync with special
    };

    SpecialValues: AbilitySpecials = {
        cooldown: {
            value: [21, 18, 15, 12],
            LinkedSpecialBonus: "special_bonus_itachi_1",
        },
        silence_duration: {
            value: [1.5, 2.0, 2.5, 3.0],
            LinkedSpecialBonus: "special_bonus_itachi_4",
        },
        cast_range: [675, 750, 825, 900],
        silence_radius: 300,
    };

    Precache(context: CScriptPrecacheContext): void {
        PrecacheResource("soundfile", "soundevents/itachi_crows.vsndevts", context);
        PrecacheResource("particle", "particles/world_creature_fx/crows.vpcf", context);
    }

    GetCooldown(level: number): number {
        let cooldown = this.GetLevelSpecialValueFor("cooldown", level);
        print("cooldown")
        print(cooldown)
        print("getting talent value")
        const talent = this.GetCaster().FindTalentValue("itachi_special_bonus_1", "value");
        // assume negative value
        print("talent");
        print(talent);
        cooldown += talent;
        return cooldown;
    }
    //

    // GetManaCost(level: number): number {
    //     return 90;
    // }

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

        // Workaround incompatibility of BEHAVIOR_DONT_RESUME_MOVEMENT and BEHAVIOR_IMMEDIATE
        // We're going for behavior similar to antimage blink, though faster/no animation:
        // 1. If you click beyond cast range, you immediately blink to cast range
        // 2. When you land, all actions are cancelled, you don't start hitting
        //    anything, you don't start moving to your previous move command
        // BEHAVIOR_DONT_RESUME_MOVEMENT accomplishes (2), but
        // BEHAVIOR_IMMEDIATE is necessary to achieve (1), and including
        // BEHAVIOR_IMMEDIATE seems to mean that BEHAVIOR_DONT_RESUME_MOVEMENT
        // gets ignored.
        caster.Hold();
        caster.FaceTowards((point + direction.Normalized() * Vector(100, 100, 0)) as Vector);
    }
}
