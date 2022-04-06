import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class kakashi_lightning_release extends BaseAbility {

    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle", "particles/units/heroes/hero_treant/treant_overgrowth_vines_mid.vpcf", context);
        PrecacheResource("particle", "particles/econ/creeps/creep_2021_dire/creep_2021_dire_siege_death_smoke.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/kakashi/game_sounds_kakashi.vsndevts", context);
        PrecacheResource("soundfile", "soundevents/heroes/kakashi/game_sounds_vo_kakashi.vsndevts", context);
    }

    /****************************************/

    GetBehavior(): AbilityBehavior | Uint64 {
        if (this.GetCaster().HasModifier("modifier_kakashi_kamui_channeling")) {
            return AbilityBehavior.NO_TARGET + AbilityBehavior.IMMEDIATE + AbilityBehavior.IGNORE_CHANNEL;
        } else {
            return super.GetBehavior();
        }
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();
        let duration = this.GetSpecialValueFor("active_duration");

        caster.AddNewModifier(caster, this, "modifier_kakashi_lightning_release", {duration: duration});
    }
}

@registerModifier()
export class modifier_kakashi_lightning_release extends BaseModifier
{
    damage?: number;
    root_duration?: number;
    invis_duration?: number;

    /****************************************/

    IsPurgable(): boolean       {return false}
    RemoveOnDeath(): boolean    {return true}

    /****************************************/

    OnCreated(params: Object): void {
        let ability = this.GetAbility()!;
        let parent = this.GetParent();

        this.damage = ability.GetSpecialValueFor("damage");
        this.root_duration = ability.GetSpecialValueFor("root_duration") + parent.FindTalentValue("special_bonus_kakashi_3");
        this.invis_duration = ability.GetSpecialValueFor("invis_duration") + parent.FindTalentValue("special_bonus_kakashi_4");
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.ON_TAKEDAMAGE,
        ModifierFunction.ABSOLUTE_NO_DAMAGE_MAGICAL,
        ModifierFunction.ABSOLUTE_NO_DAMAGE_PHYSICAL,
        ModifierFunction.ABSOLUTE_NO_DAMAGE_PURE
    ]}

    /****************************************/

    OnTakeDamage(params: ModifierInstanceEvent): void {
        if (!IsServer()) return;

        let unit = params.unit;
        let ability = this.GetAbility();
        let attacker = params.attacker;

        if (!unit || unit != this.GetParent() || !attacker.IsOwnedByAnyPlayer()) return;

        if (bit.band(params.damage_flags, DamageTypes.HP_REMOVAL) == DamageTypes.HP_REMOVAL) return;        

        unit.Purge(false, true, false, false, false);   
        unit.AddNewModifier(unit, ability, "modifier_kakashi_lightning_release_invisibility", {duration: this.invis_duration});
        
        EmitSoundOn("Hero_Kakashi.LightningRelease.Proc", unit);
        let release_fx = ParticleManager.CreateParticle("particles/econ/creeps/creep_2021_dire/creep_2021_dire_siege_death_smoke.vpcf", ParticleAttachment.WORLDORIGIN, undefined);
        ParticleManager.SetParticleControl(release_fx, 0, unit.GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(release_fx);

        let damage_table: ApplyDamageOptions = {
            attacker: unit,
            victim: unit,
            damage: this.damage!,
            damage_type: ability?.GetAbilityDamageType()!,
            ability: ability
        }

        let enemies = FindUnitsInRadius(unit.GetTeamNumber(), unit.GetAbsOrigin(), undefined, 300, UnitTargetTeam.ENEMY, UnitTargetType.HERO + UnitTargetType.BASIC, UnitTargetFlags.NO_INVIS, FindOrder.ANY, false);

        enemies.forEach((enemy) => {
            if (!enemy.IsMagicImmune()) {
                damage_table.victim = enemy;
                ApplyDamage(damage_table);

                enemy.AddNewModifier(unit, ability, "modifier_kakashi_lightning_release_root", {duration: this.root_duration! * (1 - enemy.GetStatusResistance())});
            }
        });

        this.Destroy();
    }

    /****************************************/

    GetAbsoluteNoDamagePure(event: ModifierAttackEvent): 0 | 1 {
        return this.ShouldNegateDamage(event.attacker);
    }

    /****************************************/

    GetAbsoluteNoDamageMagical(event: ModifierAttackEvent): 0 | 1 {
        return this.ShouldNegateDamage(event.attacker);
    }

    /****************************************/

    GetAbsoluteNoDamagePhysical(event: ModifierAttackEvent): 0 | 1 {
        return this.ShouldNegateDamage(event.attacker);
    }

    /****************************************/

    ShouldNegateDamage(attacker: CDOTA_BaseNPC): 0 | 1 {
        if (!IsServer()) return 0;

        if (attacker && attacker.IsOwnedByAnyPlayer()) return 1;

        return 0;
    }
}

@registerModifier()
export class modifier_kakashi_lightning_release_invisibility extends BaseModifier
{
    IsPurgable(): boolean       {return false}
    RemoveOnDeath(): boolean    {return true}

    /****************************************/

    DeclareFunctions(){ return [ModifierFunction.INVISIBILITY_LEVEL] }

    /****************************************/

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {[ModifierState.INVISIBLE]: true};
    }

    /****************************************/

    GetModifierInvisibilityLevel(): number {
        return 1
    }
}

@registerModifier()
export class modifier_kakashi_lightning_release_root extends BaseModifier
{
    IsPurgable(): boolean       {return true}

    /****************************************/

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {[ModifierState.ROOTED]: true};
    }

    /****************************************/

    GetEffectName(): string {
        return "particles/units/heroes/hero_treant/treant_overgrowth_vines_mid.vpcf";
    }

    /****************************************/
    
    GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.ABSORIGIN;
    }
}