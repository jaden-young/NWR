import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

interface SaiInnate extends CDOTABaseAbility
{
    ApplyDebuff(target: CDOTA_BaseNPC): void;
}

@registerAbility()
export class sai_snake_entanglement extends BaseAbility
{
    Precache(context: CScriptPrecacheContext): void{
        //PrecacheResource("particle", "", context);
        PrecacheResource("soundfile", "soundevents/heroes/sai/game_sounds_sai.vsndevts", context);
        //PrecacheResource("soundfile", "soundevents/heroes/sai/game_sounds_vo_sai.vsndevts", context);
    }

    /****************************************/

    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }

    /****************************************/
   
    OnSpellStart(): void {
        let caster = this.GetCaster();
        let position = this.GetCursorPosition();
        let duration = this.GetSpecialValueFor("duration")

        CreateModifierThinker(caster, this, "modifier_sai_snake_entanglement", {duration: duration}, position, caster.GetTeamNumber(), false);

        EmitSoundOnLocationWithCaster(position, "Hero_Sai.SnakeEntanglement.Cast", caster);
    }
}

@registerModifier()
export class modifier_sai_snake_entanglement extends BaseModifier
{
    radius: number = 0;
    debuff_duration?: number;

    /****************************************/

    OnCreated(params: object): void {
        if (!IsServer()) return;
        let ability = this.GetAbility();

        this.radius = ability!.GetSpecialValueFor("radius");
        this.debuff_duration = ability!.GetSpecialValueFor("debuff_duration");

        let pit_fx = ParticleManager.CreateParticle("particles/econ/items/underlord/underlord_ti8_immortal_weapon/underlord_ti8_immortal_pitofmalice.vpcf", ParticleAttachment.ABSORIGIN, this.GetParent());
        ParticleManager.SetParticleControl(pit_fx, 1, Vector(this.radius, this.radius/40, 1));
        ParticleManager.SetParticleControl(pit_fx, 2, Vector(this.GetRemainingTime(), 0, 0));
        this.AddParticle(pit_fx, false, false, -1, false, false);
        
        this.StartIntervalThink(ability!.GetSpecialValueFor("slow_growth_interval"));
        this.OnIntervalThink();
    }

    OnIntervalThink(): void {
        let parent = this.GetParent();

        let enemies = FindUnitsInRadius(parent.GetTeamNumber(),
            parent.GetAbsOrigin(),
            undefined, this.radius,
            UnitTargetTeam.ENEMY,
            UnitTargetType.BASIC + UnitTargetType.HERO,
            UnitTargetFlags.NONE, 
            FindOrder.ANY,
            false
        );

        enemies.forEach(enemy => {
            enemy.AddNewModifier(this.GetCaster(), this.GetAbility(), "modifier_sai_snake_entanglement_slow", {duration: this.debuff_duration});
        });
    }

}

@registerModifier()
export class modifier_sai_snake_entanglement_slow extends BaseModifier
{
    turn_slow?: number;
    move_slow_per_sec?: number;
    max_move_slow?: number;
    current_move_slow?: number;
    damage?: number;
    damage_table?: ApplyDamageOptions;

    /****************************************/

    OnCreated(params: object): void {
        let ability = this.GetAbility();
        let interval = ability!.GetSpecialValueFor("slow_growth_interval");

        this.turn_slow = -ability!.GetSpecialValueFor("turn_slow");
        this.move_slow_per_sec = -ability!.GetSpecialValueFor("move_slow_per_sec") * interval;
        this.max_move_slow = -ability!.GetSpecialValueFor("max_move_slow");
        this.damage = (ability!.GetSpecialValueFor("damage_per_sec") + this.GetCaster()!.FindTalentValue("special_bonus_sai_2")) * interval;

        this.current_move_slow = this.move_slow_per_sec;

        if (!IsServer()) return;

        this.damage_table = {
            attacker: this.GetCaster()!,
            victim: this.GetParent(),
            damage: this.damage,
            damage_type: DamageTypes.MAGICAL,
            ability: ability
        }

        let innate = this.GetCaster()!.FindAbilityByName("sai_innate_passive") as SaiInnate;
        if (innate) innate.ApplyDebuff(this.GetParent());

        this.StartIntervalThink(interval);
        this.OnIntervalThink();
    }

    OnIntervalThink(): void {
        ApplyDamage(this.damage_table!);
    }

    /****************************************/

    OnRefresh(params: object): void {
        this.current_move_slow = math.max(this.current_move_slow! + this.move_slow_per_sec!, this.max_move_slow!);

        if (!IsServer()) return;

        let innate = this.GetCaster()!.FindAbilityByName("sai_innate_passive") as SaiInnate;
        if (innate) innate.ApplyDebuff(this.GetParent());
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.MOVESPEED_BONUS_PERCENTAGE,
        ModifierFunction.TURN_RATE_PERCENTAGE
    ]}

    /****************************************/

    GetModifierMoveSpeedBonus_Percentage(): number {
        return this.current_move_slow!;
    }

    /****************************************/

    GetModifierTurnRate_Percentage(): number {
        return this.turn_slow!;
    }

    /****************************************/

    GetEffectName(): string {
        return "particles/units/heroes/hero_batrider/batrider_stickynapalm_debuff.vpcf"
    }

    /****************************************/

    GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.ABSORIGIN_FOLLOW
    }
}