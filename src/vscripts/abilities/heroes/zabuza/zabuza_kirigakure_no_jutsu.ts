import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

interface kv
{
    shard_cast?: number;
}

@registerAbility()
export class zabuza_kirigakure_no_jutsu extends BaseAbility
{
    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle", "particles/units/heroes/zabuza/zabuza_mist_core.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/zabuza/zabuza_mist_talking.vsndevts", context);
        PrecacheResource("soundfile", "soundevents/heroes/zabuza/zabuza_mist_loop.vsndevts", context);
        PrecacheResource("soundfile", "soundevents/heroes/zabuza/zabuza_mist_cast.vsndevts", context);	
    }

    /****************************************/

    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }

    /****************************************/

    OnAbilityPhaseStart(): boolean {
        EmitSoundOn("zabuza_mist_cast", this.GetCaster());
        return true
    }

    /****************************************/
   
    OnSpellStart(): void {
        this.CreateMist(false, this.GetCursorPosition());
    }

    /****************************************/

    CreateMist(shard_cast: boolean, position: Vector): void {
        let caster = this.GetCaster();
        let duration = this.GetSpecialValueFor("duration")

        CreateModifierThinker(caster, this, "modifier_zabuza_kirigakure_no_jutsu", {duration: duration, shard_cast: shard_cast}, position, caster.GetTeamNumber(), false);

        EmitSoundOn("zabuza_mist_talking", caster);
    }
}

@registerModifier()
export class modifier_zabuza_kirigakure_no_jutsu extends BaseModifier
{
    radius: number = 0;
    fade_delay?: number;

    /****************************************/
    
    IsPurgable(): boolean               {return true}
    IsAura(): boolean                   {return true}
    GetAuraRadius(): number             {return this.radius}
    GetAuraSearchTeam(): UnitTargetTeam {return UnitTargetTeam.FRIENDLY}
    GetAuraSearchType(): UnitTargetType {return UnitTargetType.HERO}
    GetModifierAura(): string           {return "modifier_zabuza_kirigakure_no_jutsu_aura"}

    /****************************************/

    OnCreated(params: kv): void {
        if (!IsServer()) return;
        let parent = this.GetParent();
        let ability = this.GetAbility();
        
        this.radius = params.shard_cast == 1 ? ability!.GetSpecialValueFor("shard_radius") : ability!.GetSpecialValueFor("radius");
        this.fade_delay = ability!.GetSpecialValueFor("fade_delay") + this.GetCaster()!.FindTalentValue("special_bonus_zabuza_4");
        
        let mist_fx = ParticleManager.CreateParticle("particles/units/heroes/zabuza/zabuza_mist_core.vpcf", ParticleAttachment.ABSORIGIN, parent);
        ParticleManager.SetParticleControl(mist_fx, 1, Vector(this.radius+100, 0, 150));
        this.AddParticle(mist_fx, false, false, -1, false, false);

        EmitSoundOn("zabuza_mist_loop", parent);
        
        this.StartIntervalThink(0.1);
        this.OnIntervalThink();
    }

    OnDestroy(): void {
        if (!IsServer()) return;

        StopSoundOn("zabuza_mist_loop", this.GetParent());
    }

    /****************************************/

    OnIntervalThink(): void {
        let parent = this.GetParent();

        let allies = FindUnitsInRadius(parent.GetTeamNumber(),
            parent.GetAbsOrigin(),
            undefined, this.radius,
            UnitTargetTeam.FRIENDLY,
            UnitTargetType.HERO + UnitTargetType.BASIC, 
            UnitTargetFlags.NONE, 
            FindOrder.ANY,
            false
        );

        allies.forEach(ally => {
            if (ally.IsHero() && !ally.HasModifier("modifier_zabuza_kirigakure_no_jutsu_fade") && !ally.HasModifier("modifier_zabuza_kirigakure_no_jutsu_invis"))
                ally.AddNewModifier(this.GetCaster(), this.GetAbility(), "modifier_zabuza_kirigakure_no_jutsu_fade", {duration: this.fade_delay});

            if (ally.GetPlayerOwnerID() == parent.GetPlayerOwnerID())
                ally.AddNewModifier(this.GetCaster(), this.GetAbility(), "modifier_zabuza_kirigakure_no_jutsu_speed", {duration: -1});
        });
    }

}

@registerModifier()
export class modifier_zabuza_kirigakure_no_jutsu_speed extends BaseModifier
{
    move_speed?: number;
    damage?: number;

    /****************************************/

    IsPurgable(): boolean       {return false}
    RemoveOnDeath(): boolean    {return true}
    
    /****************************************/

    OnCreated(params: object): void {
        this.move_speed = this.GetAbility()?.GetSpecialValueFor("bonus_movespeed");
        this.damage = this.GetAbility()!.GetSpecialValueFor("special_bonus_5_damage") + this.GetCaster()!.FindTalentValue("special_bonus_zabuza_5");

        if (IsServer()) this.StartIntervalThink(0.1);
    }

    /****************************************/

    OnIntervalThink(): void {
        if (!this.GetParent().HasModifier("modifier_zabuza_kirigakure_no_jutsu_aura")) this.Destroy();
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.MOVESPEED_BONUS_PERCENTAGE,
        ModifierFunction.PREATTACK_BONUS_DAMAGE
    ]}

    /****************************************/

    GetModifierMoveSpeedBonus_Percentage(): number {
        return this.move_speed!;
    }

    /****************************************/

    GetModifierPreAttack_BonusDamage(): number {
        return this.damage!;
    }
}

@registerModifier()
export class modifier_zabuza_kirigakure_no_jutsu_fade extends BaseModifier
{
    duration?: number;

    /****************************************/

    IsPurgable(): boolean       {return false}
    RemoveOnDeath(): boolean    {return true}

    /****************************************/

    OnCreated(params: object): void {
        if (IsServer()) this.StartIntervalThink(0.1);
    }

    /****************************************/

    OnDestroy(): void {
        if (!IsServer()) return;
        if (this.GetParent().HasModifier("modifier_zabuza_kirigakure_no_jutsu_aura")) {
            this.GetParent().AddNewModifier(this.GetCaster(), this.GetAbility(), "modifier_zabuza_kirigakure_no_jutsu_invis", {duration: -1});
        }
    }

    /****************************************/

    OnIntervalThink(): void {
        if (!this.GetParent().HasModifier("modifier_zabuza_kirigakure_no_jutsu_aura")) this.Destroy();
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.ON_ATTACK_LANDED,
        ModifierFunction.ON_ABILITY_EXECUTED
    ]}

    /****************************************/

    OnAttackLanded(event: ModifierAttackEvent): void {
        if (!IsServer()) return;
        
        if (event.attacker != this.GetParent()) return;

        this.ForceRefresh();
    }

    /****************************************/
    
    OnAbilityExecuted(event: ModifierAbilityEvent): void {
        if (!IsServer()) return;

        if (event.unit != this.GetParent()) return;

        this.ForceRefresh();
    }
}


@registerModifier()
export class modifier_zabuza_kirigakure_no_jutsu_invis extends BaseModifier
{
    fade_delay?: number;

    /****************************************/

    IsPurgable(): boolean       {return false}
    RemoveOnDeath(): boolean    {return true}

    /****************************************/

    OnCreated(params: object): void {
        this.fade_delay = this.GetAbility()!.GetSpecialValueFor("fade_delay") + this.GetCaster()!.FindTalentValue("special_bonus_zabuza_4");
        if (IsServer()) this.StartIntervalThink(0.1);
    }

    /****************************************/

    OnDestroy(): void {
        if (!IsServer()) return;

        if (this.GetParent().HasModifier("modifier_zabuza_kirigakure_no_jutsu_aura")){
            this.GetParent().AddNewModifier(this.GetCaster(), this.GetAbility(), "modifier_zabuza_kirigakure_no_jutsu_fade", {duration: this.fade_delay});
        }
    }

    /****************************************/

    OnIntervalThink(): void {
        if (!this.GetParent().HasModifier("modifier_zabuza_kirigakure_no_jutsu_aura")) this.Destroy();
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.INVISIBILITY_LEVEL,
        ModifierFunction.ON_ATTACK_LANDED,
        ModifierFunction.ON_ABILITY_EXECUTED
    ]}

    /****************************************/

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.INVISIBLE]: true,
            [ModifierState.NO_UNIT_COLLISION]: true
        };
    }

    /****************************************/

    GetModifierInvisibilityLevel(): number {
        return 1
    }

    /****************************************/

    OnAttackLanded(event: ModifierAttackEvent): void {
        if (!IsServer()) return;
        
        if (event.attacker != this.GetParent()) return;

        this.Destroy();
    }

    /****************************************/
    
    OnAbilityExecuted(event: ModifierAbilityEvent): void {
        if (!IsServer()) return;

        if (event.unit != this.GetParent()) return;

        this.Destroy();
    }
}

@registerModifier()
export class modifier_zabuza_kirigakure_no_jutsu_aura extends BaseModifier
{
    IsPurgable(): boolean   {return false}
    IsHidden(): boolean     {return true}
}