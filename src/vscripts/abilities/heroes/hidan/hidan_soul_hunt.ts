import { BaseAbility, BaseModifier, BaseModifierMotionHorizontal, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

interface kv {
	x: number;
    y: number;
    z: number;
}

@registerAbility()
export class hidan_soul_hunt extends BaseAbility
{
    lightning_blade_fx?: ParticleID;
    active_target?: CDOTA_BaseNPC;

    /****************************************/

    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle", "particles/units/heroes/hidan/hidan_soul_hunt.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/hidan/game_sounds_hidan.vsndevts", context);
        //PrecacheResource("soundfile", "soundevents/heroes/hidan/game_sounds_vo_hidan.vsndevts", context);
    }

    /****************************************/

    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster() as CDOTA_BaseNPC_Hero;
        let origin = caster.GetAbsOrigin();
        let duration = this.GetSpecialValueFor("slow_duration");
        let base_damage = this.GetSpecialValueFor("base_damage");
        let strength_dmg_mult = this.GetSpecialValueFor("strength_dmg_mult") / 100;
        let strength = caster.GetStrength();

        let damage_table: ApplyDamageOptions = {
            attacker: caster,
            victim: caster,
            damage: base_damage + strength * strength_dmg_mult,
            damage_type: this.GetAbilityDamageType(),
            damage_flags: DamageFlag.NON_LETHAL + DamageFlag.BYPASSES_BLOCK,
            ability: this
        }

        ApplyDamage(damage_table)

        let enemies = FindUnitsInRadius(
            caster.GetTeamNumber(),
            origin,
            undefined,
            this.GetAOERadius(),
            UnitTargetTeam.ENEMY,
            UnitTargetType.BASIC + UnitTargetType.HERO,
            UnitTargetFlags.NONE,
            FindOrder.ANY,
            false
        );

        enemies.forEach(enemy => {
            damage_table.victim = enemy;
            ApplyDamage(damage_table);

            enemy.AddNewModifier(caster, this, "modifier_hidan_soul_hunt", {duration: duration * (1 - enemy.GetStatusResistance())});

            
        });

        EmitSoundOn("Hero_Hidan.SoulHunt.Cast", caster);
        ParticleManager.ReleaseParticleIndex(
            ParticleManager.CreateParticle("particles/units/heroes/hidan/hidan_soul_hunt.vpcf", ParticleAttachment.ABSORIGIN, caster)
        );        
    }
}

@registerModifier()
export class modifier_hidan_soul_hunt extends BaseModifierMotionHorizontal
{
    movespeed_slow?: number;


    /****************************************/

    OnCreated(params: kv): void {
        this.movespeed_slow = -this.GetAbility()!.GetSpecialValueFor("movespeed_slow");
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.MOVESPEED_BONUS_PERCENTAGE
    ]}

    /****************************************/

    GetModifierMoveSpeedBonus_Percentage(): number {
        return this.movespeed_slow!;
    }

}