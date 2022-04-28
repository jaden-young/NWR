import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class shisui_halo_dance extends BaseAbility {

    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle",  "particles/units/heroes/shisui/shisui_halo_dance_wave.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/shisui/game_sounds_shisui.vsndevts", context);
        //PrecacheResource("soundfile", "soundevents/heroes/shisui/game_sounds_vo_shisui.vsndevts", context);
    }

    /****************************************/

    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return this.GetSpecialValueFor("wave_range") + this.GetCaster().FindTalentValue("special_bonus_shisui_2");
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();

        caster.AddNewModifier(caster, this, "modifier_shisui_halo_dance", {duration: this.GetSpecialValueFor("duration")});
    }

    /****************************************/

    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (!target) return;

        ApplyDamage({
            attacker: this.GetCaster(),
            victim: target,
            damage: this.GetSpecialValueFor("damage") + this.GetCaster().FindTalentValue("special_bonus_shisui_1"),
            damage_type: this.GetAbilityDamageType(),
            ability: this
        })
    }
}

@registerModifier()
export class modifier_shisui_halo_dance extends BaseModifier
{
    speed?: number;
    projectile?: CreateLinearProjectileOptions;

    /****************************************/

    OnCreated(params: object): void {
        if (!IsServer()) return;
        let ability = this.GetAbility();
        let parent = this.GetParent();

        let wave_radius = ability?.GetSpecialValueFor("wave_radius");
        let wave_range = ability!.GetSpecialValueFor("wave_range") + parent.FindTalentValue("special_bonus_shisui_2");
        this.speed = ability?.GetSpecialValueFor("wave_speed");

        this.projectile = {
            Ability: this.GetAbility(),
            EffectName: "particles/units/heroes/shisui/shisui_halo_dance_wave.vpcf",
            vSpawnOrigin: parent.GetAttachmentOrigin(parent.ScriptLookupAttachment("attach_attack1")) as Vector,
            Source: parent,
            bHasFrontalCone: true,
            fDistance: wave_range,
            fStartRadius: wave_radius,
            fEndRadius: wave_radius,
            iUnitTargetTeam: ability?.GetAbilityTargetTeam(),
            iUnitTargetType: ability?.GetAbilityTargetType(),
            iUnitTargetFlags: ability?.GetAbilityTargetFlags(),
            vVelocity: undefined
        }
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.ON_ATTACK_LANDED
    ]}

    /****************************************/

    OnAttackLanded(event: ModifierAttackEvent): void {
        if (!IsServer()) return;
        let attacker = event.attacker;
        let target = event.target;

        if (attacker != this.GetParent() || target.IsBuilding() || target.IsOther()) return;

        this.projectile!.vSpawnOrigin = attacker.GetAttachmentOrigin(attacker.ScriptLookupAttachment("attach_attack1")) as Vector,
        this.projectile!.vVelocity = (target.GetAbsOrigin() - attacker.GetAbsOrigin() as Vector).Normalized() * this.speed! as Vector;
        ProjectileManager.CreateLinearProjectile(this.projectile!);
    }
}