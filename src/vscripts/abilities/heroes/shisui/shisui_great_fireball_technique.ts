import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

interface extra {
    sound_eid: EntityIndex
}

@registerAbility()
export class shisui_great_fireball_technique extends BaseAbility {

    precast_vo: boolean = false;

    /****************************************/

    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle",  "particles/units/heroes/sasuke/sasuke_great_fireball_technique_technique.vpcf", context);
        PrecacheResource("particle",  "particles/units/heroes/sasuke/sasuke_great_fireball_technique_impact.vpcf", context);
        PrecacheResource("particle",  "particles/units/heroes/sasuke/sasuke_great_fireball_technique_debuff.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/shisui/game_sounds_shisui.vsndevts", context);
        PrecacheResource("soundfile", "soundevents/heroes/shisui/game_sounds_vo_shisui.vsndevts", context);
    }

    /****************************************/

    GetIntrinsicModifierName(): string {
        return "modifier_shisui_great_fireball_technique_tracker"
    }

    /****************************************/

    GetCastPoint(): number {
        let caster = this.GetCaster();
        let stacks = caster.GetModifierStackCount(this.GetIntrinsicModifierName(), caster);

        return math.max(this.GetSpecialValueFor("min_cast_point"), super.GetCastPoint() - stacks * this.GetSpecialValueFor("cast_time_per_action"));
    }

    /****************************************/

    OnAbilityPhaseStart(): boolean {
        if (this.GetCastPoint() >= 0.5) {
            EmitSoundOn("VO_Hero_Shisui.GreatFireball.Precast", this.GetCaster());
            this.precast_vo = true;
        } else {
            this.precast_vo = false;
        }

        return true;
    }

    /****************************************/

    OnAbilityPhaseInterrupted(): void {
        if (this.precast_vo) {
            StopSoundOn("VO_Hero_Shisui.GreatFireball.Precast", this.GetCaster());
        }
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();
        let position = this.GetCursorPosition();
        let radius = this.GetSpecialValueFor("radius");
        let speed = this.GetSpecialValueFor("speed");

        let direction = position - caster.GetAbsOrigin() as Vector;
        direction.z = 0;
        direction = direction.Normalized();

        let sound_ent = CreateModifierThinker(caster, this, "", {}, caster.GetAbsOrigin(), caster.GetTeamNumber(), false);
        EmitSoundOn("Hero_Shisui.GreatFireball.Cast", sound_ent)

        EmitSoundOn("VO_Hero_Shisui.GreatFireball.Cast", caster);

        ProjectileManager.CreateLinearProjectile({
            Ability: this,
            EffectName: "particles/units/heroes/sasuke/sasuke_great_fireball_technique.vpcf",
            vSpawnOrigin: caster.GetAttachmentOrigin(caster.ScriptLookupAttachment("attach_mouth")) as Vector,
            fDistance: this.GetEffectiveCastRange(position, caster),
            Source: caster,
            fStartRadius: radius,
            fEndRadius: radius,
            iUnitTargetTeam: UnitTargetTeam.ENEMY,
            iUnitTargetType: UnitTargetType.BASIC + UnitTargetType.HERO,
            iUnitTargetFlags: UnitTargetFlags.NONE,
            vVelocity: direction * speed as Vector,
            ExtraData: {
                sound_eid: sound_ent.entindex()
            }
        });

    }

    /****************************************/

    OnProjectileThink_ExtraData(location: Vector, extraData: extra): void {
        let sound_ent = EntIndexToHScript(extraData.sound_eid);
        if (!sound_ent || sound_ent.IsNull()) return;

        sound_ent.SetAbsOrigin(location);
    }

    /****************************************/

    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, extraData: extra): boolean | void {
        if (!target || !this || this.IsNull()) {
            let sound_ent = EntIndexToHScript(extraData.sound_eid);
            if (!sound_ent || sound_ent.IsNull()) return;
	        UTIL_Remove(sound_ent)
            return;
        }
        let caster = this.GetCaster();

        let damage_table : ApplyDamageOptions = {
            attacker: caster,
            victim: target,
            damage: this.GetSpecialValueFor("damage"),
            damage_type: this.GetAbilityDamageType(),
            ability: this
        }

        ApplyDamage(damage_table);
        target.AddNewModifier(caster, this, "modifier_shisui_great_fireball_technique", {duration: this.GetSpecialValueFor("duration") * (1 - target.GetStatusResistance())});

        ParticleManager.ReleaseParticleIndex(
            ParticleManager.CreateParticle("particles/units/heroes/sasuke/sasuke_great_fireball_technique_impact.vpcf", ParticleAttachment.ABSORIGIN, target)
        );

        EmitSoundOn("Hero_Shisui.GreatFireball.Impact", target);
    }
}

@registerModifier()
export class modifier_shisui_great_fireball_technique extends BaseModifier
{
    move_slow?: number;
    burn_damage?: number;
    damage_table?: ApplyDamageOptions;

    /****************************************/

    OnCreated(params: object): void {
        let ability = this.GetAbility()!;
        this.move_slow = -ability.GetSpecialValueFor("move_slow");
        this.burn_damage = ability.GetSpecialValueFor("burn_damage") + this.GetCaster()!.FindTalentValue("special_bonus_shisui_3");
        let interval = ability.GetSpecialValueFor("dps_interval");

        if (!IsServer()) return;
        this.damage_table = {
            attacker: this.GetCaster()!,
            victim: this.GetParent(),
            damage: this.burn_damage * interval,
            damage_type: this.GetAbility()?.GetAbilityDamageType()!,
            ability: this.GetAbility()
        }

        this.StartIntervalThink(interval);
        this.OnIntervalThink();
    }

    /****************************************/

    OnIntervalThink(): void {
        ApplyDamage(this.damage_table!);
        SendOverheadEventMessage(undefined, OverheadAlert.BONUS_SPELL_DAMAGE, this.GetParent(), this.damage_table!.damage, undefined);
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.MOVESPEED_BONUS_PERCENTAGE,
    ]}

    /****************************************/

    GetModifierMoveSpeedBonus_Percentage(): number {
        return this.move_slow!;
    }

    /****************************************/
    
    GetEffectName(): string {
        return "particles/units/heroes/sasuke/sasuke_great_fireball_technique_debuff.vpcf"
    }

    /****************************************/

    GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.ABSORIGIN_FOLLOW
    }
}

@registerModifier()
export class modifier_shisui_great_fireball_technique_tracker extends BaseModifier
{
    action_window?: number;
    current_stacks?: number;
    max_stacks?: number;
    cast_time_per_action?: number;
    last_reset: number = -1;
    activity?: string;
    castpoint_activies: any = {
        [0]: "",
        [2]: "slow",
        [4]: "fast",
        [6]: "faster",
        [8]: "superfast"
    }
    
    /****************************************/

    OnCreated(params: object): void {
        let ability = this.GetAbility();

        let base_cast_point = ability?.GetSpecialValueFor("cast_point")!;
        let min_cast_point = ability?.GetSpecialValueFor("min_cast_point")!
        this.action_window = ability?.GetSpecialValueFor("action_window");
        this.cast_time_per_action = ability?.GetSpecialValueFor("cast_time_per_action")!;

        this.max_stacks = math.floor(((base_cast_point - min_cast_point) / this.cast_time_per_action) + 0.5);
        this.current_stacks = 0;
        this.activity = this.castpoint_activies[this.current_stacks];
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.ON_ATTACK_LANDED,
        ModifierFunction.ON_ABILITY_EXECUTED,
        ModifierFunction.TRANSLATE_ACTIVITY_MODIFIERS,
        ModifierFunction.TOOLTIP
    ]}

    /****************************************/

    OnAttackLanded(event: ModifierAttackEvent): void {
        if (!IsServer()) return;
        this.UpdateStacks(event.attacker);
    }

    /****************************************/

    OnAbilityExecuted(event: ModifierAbilityEvent): void {
        if (!IsServer()) return;
        let ability = event.ability;

        if (ability == this.GetAbility()) {
            this.last_reset = GameRules.GetDOTATime(true, true);
            this.SetStackCount(0);
            this.current_stacks = 0;
            this.activity = "";
            return;
        }

        if (ability.IsItem()) return;

        this.UpdateStacks(event.unit);
    }

    /****************************************/

    GetActivityTranslationModifiers(): string {
        return this.activity!;
    }

    /****************************************/

    OnTooltip(): number {
        return this.cast_time_per_action!;
    }

    /****************************************/

    UpdateStacks(unit: CDOTA_BaseNPC): void {
        if (!unit || unit != this.GetParent()) return;
        let creation_time = GameRules.GetDOTATime(true, true);

        this.current_stacks!++;
        this.SetStackCount(math.min(this.max_stacks!, this.current_stacks!));
        
        Timers.CreateTimer(this.action_window!, () => {
            if (this.last_reset > creation_time) return;
            this.current_stacks!--;
            this.SetStackCount(math.min(this.max_stacks!, this.current_stacks!));
        });

        let stacks = this.GetStackCount();
        if (stacks % 2 != 0)  stacks--;

        this.activity = this.castpoint_activies[stacks];
    }
}