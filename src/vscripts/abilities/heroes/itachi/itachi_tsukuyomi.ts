import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class itachi_tsukuyomi extends BaseAbility
{
    target?: CDOTA_BaseNPC_Hero;

    /****************************************/

    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle", "particles/units/heroes/hero_bane/bane_fiends_grip.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/kakashi/game_sounds_kakashi.vsndevts", context);
        PrecacheResource("soundfile", "soundevents/heroes/kakashi/game_sounds_vo_kakashi.vsndevts", context);
    }

    /****************************************/
    
    Spawn(): void {
        if (!IsServer() || this.GetCaster().IsRealHero()) return;
        ListenToGameEvent("dota_player_learned_ability", (event) => this.OnPlayerLearnedAbility(event), undefined);
    }
    
    /****************************************/

    OnPlayerLearnedAbility(event: DotaPlayerLearnedAbilityEvent): void {
        let hero = PlayerResource.GetSelectedHeroEntity(event.PlayerID)
        let ability_name = event.abilityname

        if (hero != this.GetCaster() || ability_name != "itachi_amaterasu") return;

        this.SetLevel(this.GetCaster().FindAbilityByName("itachi_amaterasu")!.GetLevel());
    }

    /****************************************/

    OnUpgrade(): void {
        let amaterasu_ability = this.GetCaster().FindAbilityByName("itachi_amaterasu")

        if (amaterasu_ability) amaterasu_ability.SetLevel(this.GetLevel());
    }

    /****************************************/

    GetChannelTime(): number {
        return super.GetChannelTime() + this.GetCaster()!.FindTalentValue("special_bonus_itachi_6");
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();
        let target = this.GetCursorTarget();
        let channel_time = this.GetChannelTime();

        if (target?.TriggerSpellAbsorb(this)) return;

        this.target = target as CDOTA_BaseNPC_Hero;

        target?.AddNewModifier(caster, this, "modifier_itachi_tsukuyomi", {duration: channel_time});

        EmitSoundOn("Hero_Itachi.Tsukuyomi.Channel", this.target);
        EmitSoundOn("VO_Hero_Itachi.Tsukuyomi.Cast", caster);
    }

    /****************************************/

    OnChannelFinish(interrupted: boolean): void {
        let caster = this.GetCaster();
        this.target?.RemoveModifierByNameAndCaster("modifier_itachi_tsukuyomi", caster);

        if (interrupted) StopSoundOn("Hero_Itachi.Tsukuyomi.Channel", this.target!);
    }
}

@registerModifier()
export class modifier_itachi_tsukuyomi extends BaseModifier
{
    damage_per_second?: number;
    mana_drain?: number;
    interval?: number;
    target_facing_mult?: number;
    angle?: number;
    damage_table?: ApplyDamageOptions;

    /****************************************/

    IsPurgable(): boolean       {return false}
    RemoveOnDeath(): boolean    {return true}

    /****************************************/

    OnCreated(params: Object): void {
        let ability = this.GetAbility()!;

        this.interval = ability.GetSpecialValueFor("interval");
        this.damage_per_second = ability.GetSpecialValueFor("damage_per_second") * this.interval;
        this.mana_drain = ability.GetSpecialValueFor("mana_drain") * this.interval;
        this.target_facing_mult = ability.GetSpecialValueFor("target_facing_mult");
        this.angle = ability.GetSpecialValueFor("angle");
        
        if (!IsServer()) return;

        this.damage_table = {
            attacker: this.GetCaster()!,
            victim: this.GetParent(),
            damage: this.damage_per_second,
            damage_type: this.GetAbility()?.GetAbilityDamageType()!,
            ability: this.GetAbility()
        }

        this.StartIntervalThink(this.interval);
        this.OnIntervalThink();
    }

    OnDestroy(): void {
        if (!IsServer()) return;
        //this.OnIntervalThink();
    }

    OnIntervalThink(): void {
        let is_facing_caster = this.IsFacingCaster()
        let parent = this.GetParent();

        let mana_drain = is_facing_caster ? this.mana_drain! * this.target_facing_mult! : this.mana_drain as number;
        this.damage_table!.damage = is_facing_caster ? this.damage_per_second! * this.target_facing_mult! : this.damage_per_second as number;
        let mana_to_drain = parent.GetMaxMana() * mana_drain / 100;

        ApplyDamage(this.damage_table!);
        parent.ReduceMana(mana_to_drain);
        this.GetCaster()?.GiveMana(mana_to_drain);
    }

    IsFacingCaster(): boolean {
        let caster = this.GetCaster()!
        let parent = this.GetParent()

        let direction = -caster.GetForwardVector() as Vector;
        let parent_direction = parent.GetForwardVector();

        return parent_direction.Dot(direction) > 1 - (this.angle!/180);
    }

    /****************************************/

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.PROVIDES_VISION]: true,
            [ModifierState.STUNNED]: true,
            [ModifierState.SILENCED]: true
        };
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.OVERRIDE_ANIMATION,
        ModifierFunction.TOOLTIP,
        ModifierFunction.TOOLTIP2
    ]}

    /****************************************/

    GetOverrideAnimation(): GameActivity {
        return GameActivity.DOTA_FLAIL
    }

    /****************************************/

    GetEffectName(): string {
        return "particles/units/heroes/hero_bane/bane_fiends_grip.vpcf";
    }

    /****************************************/

    GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.ABSORIGIN_FOLLOW;
    }

    /****************************************/

    OnTooltip(): number {
        return this.mana_drain!;
    }

    /****************************************/

    OnTooltip2(): number {
        return this.interval!;
    }
}