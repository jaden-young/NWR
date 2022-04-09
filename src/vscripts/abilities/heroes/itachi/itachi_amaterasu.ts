import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class itachi_amaterasu extends BaseAbility
{
    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle", "particles/units/heroes/itachi/ephemeral.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/itachi/game_sounds_itachi.vsndevts", context);
        PrecacheResource("soundfile", "soundevents/heroes/itachi/game_sounds_vo_itachi.vsndevts", context);
    }

    /****************************************/

    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }

    /****************************************/

    OnAbilityPhaseStart(): boolean {
        EmitSoundOn("VO_Hero_Itachi.Amaterasu.Cast", this.GetCaster());
        EmitSoundOn("Hero_Itachi.Amaterasu.Build", this.GetCaster());
        return true
    }

    /****************************************/
   
    OnSpellStart(): void {
        let caster = this.GetCaster();
        let position = this.GetCursorPosition();
        let duration = this.GetSpecialValueFor("duration")

        CreateModifierThinker(caster, this, "modifier_itachi_amaterasu", {duration: duration}, position, caster.GetTeamNumber(), false);

        EmitSoundOn("Hero_Itachi.Amaterasu.Fire", caster);
    }
}

@registerModifier()
export class modifier_itachi_amaterasu extends BaseModifier
{
    radius: number = 0;
    burn_duration?: number;

    /****************************************/

    IsAura(): boolean                   {return true}
    GetAuraRadius(): number             {return this.radius}
    GetAuraSearchTeam(): UnitTargetTeam {return UnitTargetTeam.ENEMY}
    GetAuraSearchType(): UnitTargetType {return UnitTargetType.BASIC + UnitTargetType.HERO}
    GetModifierAura(): string           {return "modifier_itachi_amaterasu_proximity"}

    /****************************************/

    OnCreated(params: object): void {
        if (!IsServer()) return;
        let parent = this.GetParent();
        let ability = this.GetAbility();

        let duration = ability!.GetSpecialValueFor("duration");
        this.radius = ability!.GetSpecialValueFor("radius");
        this.burn_duration = ability!.GetSpecialValueFor("burn_duration");
        
        let amaterasu_fx = ParticleManager.CreateParticle("particles/units/heroes/itachi/amaterasu.vpcf", ParticleAttachment.ABSORIGIN, this.GetCaster());
        ParticleManager.SetParticleControl(amaterasu_fx, 0, parent.GetAbsOrigin());
        ParticleManager.SetParticleControl(amaterasu_fx, 1, parent.GetAbsOrigin());
        ParticleManager.SetParticleControl(amaterasu_fx, 2, Vector(duration, 0, 0));
        ParticleManager.SetParticleControl(amaterasu_fx, 3, Vector(this.radius, 0, 0));

        this.AddParticle(amaterasu_fx, false, false, -1, false, false);
        EmitSoundOn("Hero_Itachi.Amaterasu.BurnArea", this.GetParent());
        
        this.StartIntervalThink(1);
    }

    OnDestroy(): void {
        if (!IsServer()) return;
        StopSoundOn("Hero_Itachi.Amaterasu.BurnArea", this.GetParent());
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
            enemy.AddNewModifier(this.GetCaster(), this.GetAbility(), "modifier_itachi_amaterasu_burn", {duration: this.burn_duration});
        });
    }

}

@registerModifier()
export class modifier_itachi_amaterasu_burn extends BaseModifier
{

    high_damage?: number;
    low_damage?: number;
    damage_table?: ApplyDamageOptions;

    /****************************************/

    OnCreated(params: object): void {
        let ability = this.GetAbility();
        let caster = this.GetCaster();
        let interval = ability!.GetSpecialValueFor("interval");

        this.high_damage = (ability!.GetSpecialValueFor("damage_per_second") + caster!.FindTalentValue("special_bonus_itachi_7")) * interval;
        this.low_damage = ability!.GetSpecialValueFor("burn_dps") * interval;

        if (!IsServer()) return;

        this.damage_table = {
            attacker: this.GetCaster() as CDOTA_BaseNPC,
            victim: this.GetParent(),
            damage: this.high_damage,
            damage_type: ability!.GetAbilityDamageType(),
            ability: ability
        }

        this.StartIntervalThink(interval);
        this.OnIntervalThink();
    }

    /****************************************/

    OnIntervalThink(): void {
        this.damage_table!.damage = this.IsInsideFlames() ? this.high_damage! : this.low_damage!;
        ApplyDamage(this.damage_table!);
        SendOverheadEventMessage(undefined, OverheadAlert.BONUS_SPELL_DAMAGE, this.GetParent(), this.damage_table!.damage * (1 + this.GetCaster()!.GetSpellAmplification(false)), undefined);
        EmitSoundOn("Hero_Itachi.Amaterasu.BurnLayer", this.GetParent());
    }

    /****************************************/

    IsInsideFlames(): boolean {
        return this.GetParent().HasModifier("modifier_itachi_amaterasu_proximity");
    }

    /****************************************/

    GetEffectName(): string {
        return "particles/units/heroes/itachi/amaterasu_burn.vpcf"
    }

    /****************************************/

    GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.ABSORIGIN_FOLLOW
    }
}

@registerModifier()
export class modifier_itachi_amaterasu_proximity extends BaseModifier
{
    IsHidden(): boolean     {return true}
    IsPurgable(): boolean   {return false}
}