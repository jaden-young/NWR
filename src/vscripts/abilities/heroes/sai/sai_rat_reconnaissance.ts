import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

interface SaiInnate extends CDOTABaseAbility
{
    ApplyDebuff(target: CDOTA_BaseNPC): void;
}

interface extra
{
    rat_eid?: EntityIndex;
    enemy_eid?: EntityIndex;
}

interface rat extends CDOTA_BaseNPC
{
    emitted_sound?: boolean
}

@registerAbility()
export class sai_rat_reconnaissance extends BaseAbility
{
    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle", "particles/units/heroes/sai/sai_rat_reconnaissance_cast.vpcf", context);
        PrecacheResource("particle", "particles/units/heroes/sai/sai_rat_reconnaissance_impact.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/sai/game_sounds_sai.vsndevts", context);
        PrecacheResource("soundfile", "soundevents/heroes/sai/sai_rats_talking.vsndevts", context);
        //PrecacheResource("soundfile", "soundevents/heroes/sai/game_sounds_vo_sai.vsndevts", context);
    }


    /****************************************/

    OnAbilityPhaseStart(): boolean {
        EmitSoundOn("Hero_Sai.RatReconnaissance.PreCast", this.GetCaster());
        EmitSoundOn("sai_rats_talking", this.GetCaster());
        return true
    }

    /****************************************/
   
    OnSpellStart(): void {
        let caster = this.GetCaster();
        let origin = caster.GetAbsOrigin();
        let target_count = this.GetSpecialValueFor("max_targets") + caster.FindTalentValue("special_bonus_sai_3");
        let spawn_pos = origin + caster.GetForwardVector() * 40 as Vector

        let rat_projectile: CreateTrackingProjectileOptions = {
            Ability: this,
            EffectName: "",
            Target: undefined,
            bDodgeable: false,
            bDrawsOnMinimap: false,
            bProvidesVision: true,
            iMoveSpeed: this.GetSpecialValueFor("speed"),
            iVisionRadius: 25,
            iVisionTeamNumber: caster.GetTeamNumber(),
            vSourceLoc: spawn_pos,
            ExtraData: {
                rat_eid: -1,
                enemy_eid: -1
            }
        }

        let enemies = FindUnitsInRadius(
            caster.GetTeamNumber(),
            origin,
            undefined,
            this.GetEffectiveCastRange(origin, caster),
            UnitTargetTeam.ENEMY,
            UnitTargetType.HERO,
            UnitTargetFlags.NO_INVIS,
            FindOrder.CLOSEST,
            false
        )


        let cast_fx = ParticleManager.CreateParticle("particles/units/heroes/sai/sai_rat_reconnaissance_cast.vpcf", ParticleAttachment.CUSTOMORIGIN, undefined);
        ParticleManager.SetParticleControl(cast_fx, 0, origin + caster.GetForwardVector() * 75 as Vector);
        ParticleManager.SetParticleControlForward(cast_fx, 0, caster.GetForwardVector());
        ParticleManager.ReleaseParticleIndex(cast_fx);
        EmitSoundOn("Hero_Sai.RatReconnaissance.Cast", caster);

        
        for (let [k, enemy] of Object.entries(enemies)) {
            CreateUnitByNameAsync("npc_dota_sai_rat", spawn_pos, false, undefined, undefined, caster.GetTeamNumber(), (unit: rat) => {
                unit.AddNewModifier(caster, this, "modifier_sai_super_beast_drawing_rat", {duration: -1});
                unit.SetForwardVector(-(enemy.GetAbsOrigin() - caster.GetAbsOrigin() as Vector).Normalized() as Vector);
                unit.StartGesture(GameActivity.DOTA_RUN);
                unit.emitted_sound = false;
                
                rat_projectile.Target = enemy;
                (rat_projectile.ExtraData! as extra).rat_eid = unit.entindex();
                (rat_projectile.ExtraData! as extra).enemy_eid = enemy.entindex();
                ProjectileManager.CreateTrackingProjectile(rat_projectile);
                target_count--;
            });
            

            if (target_count <= 0) break;
        }
    }

    /****************************************/

    OnProjectileThink_ExtraData(location: Vector, extraData: extra): void {
        let rat = EntIndexToHScript(extraData.rat_eid!) as rat;
        rat?.SetAbsOrigin(GetGroundPosition(location, rat));

        if (!rat.emitted_sound) {
            rat.emitted_sound = true;
            EmitSoundOn("Hero_Sai.RatReconnaissance.Rat", rat);
        }

        let enemy = EntIndexToHScript(extraData.enemy_eid!) as CDOTA_BaseNPC;

        if (enemy && !enemy.IsNull()) {
            rat.SetForwardVector(-(enemy.GetAbsOrigin() - rat.GetAbsOrigin() as Vector).Normalized() as Vector);
        }
    }

    /****************************************/

    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, extraData: extra): boolean | void {
        if (!target) {
            this.KillRat(extraData.rat_eid!);
            return true;
        }
        
        let caster = this.GetCaster();
        let innate = caster.FindAbilityByName("sai_innate_passive") as SaiInnate;
        let vision_duration = this.GetSpecialValueFor("vision_duration") + caster.FindTalentValue("special_bonus_sai_1");
        this.KillRat(extraData.rat_eid!);

        if (innate) innate.ApplyDebuff(target);

        ApplyDamage({
            attacker: caster,
            victim: target,
            damage: this.GetSpecialValueFor("damage"),
            damage_type: this.GetAbilityDamageType(),
            ability: this
        })

        target.AddNewModifier(caster, this, "modifier_sai_rat_reconnaissance", {duration: vision_duration});
        target.AddNewModifier(caster, this, "modifier_sai_rat_reconnaissance_slow", {duration: this.GetSpecialValueFor("slow_duration") * (1 - target.GetStatusResistance())});

        EmitSoundOn("Hero_Sai.RatReconnaissance.Impact", target);
    }

    /****************************************/

    KillRat(id: EntityIndex) {
        let rat = EntIndexToHScript(id);

        if (rat) {
            let impact_fx = ParticleManager.CreateParticle("particles/units/heroes/sai/sai_rat_reconnaissance_impact.vpcf", ParticleAttachment.CUSTOMORIGIN, undefined);
            ParticleManager.SetParticleControl(impact_fx, 0, rat.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(impact_fx);
            StopSoundOn("Hero_Sai.RatReconnaissance.Cast", rat)
            UTIL_Remove(rat)
        }
    }
}

@registerModifier()
export class modifier_sai_rat_reconnaissance extends BaseModifier
{    
    DeclareFunctions(){ return [
        ModifierFunction.PROVIDES_FOW_POSITION,
    ]}

    /****************************************/
    
    GetModifierProvidesFOWVision(): 0 | 1 {
        return 1;
    }
}

@registerModifier()
export class modifier_sai_rat_reconnaissance_slow extends BaseModifier
{
    move_slow?: number;

    /****************************************/

    OnCreated(params: object): void {
        let ability = this.GetAbility();

        this.move_slow = -ability!.GetSpecialValueFor("move_slow");
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.MOVESPEED_BONUS_PERCENTAGE
    ]}

    /****************************************/

    GetModifierMoveSpeedBonus_Percentage(): number {
        return this.move_slow!;
    }
}

@registerModifier()
export class modifier_sai_super_beast_drawing_rat extends BaseModifier
{
    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.NO_HEALTH_BAR]: true,
            [ModifierState.DISARMED]: true,
            [ModifierState.NOT_ON_MINIMAP]: true,
            [ModifierState.OUT_OF_GAME]: true,
            [ModifierState.INVULNERABLE]: true,
        };
    }
}