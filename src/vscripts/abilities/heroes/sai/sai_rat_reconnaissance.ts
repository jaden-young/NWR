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

@registerAbility()
export class sai_rat_reconnaissance extends BaseAbility
{
    Precache(context: CScriptPrecacheContext): void{
        //PrecacheResource("particle", "", context);
        PrecacheResource("soundfile", "soundevents/heroes/sai/game_sounds_sai.vsndevts", context);
        //PrecacheResource("soundfile", "soundevents/heroes/sai/game_sounds_vo_sai.vsndevts", context);
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

        
        for (let [k, enemy] of Object.entries(enemies)) {
            let rat = CreateUnitByName("npc_dota_sai_rat", spawn_pos, false, undefined, undefined, caster.GetTeamNumber());
            rat.AddNewModifier(caster, this, "modifier_sai_super_beast_drawing_rat", {duration: -1});
            rat.SetForwardVector(-(enemy.GetAbsOrigin() - caster.GetAbsOrigin() as Vector).Normalized() as Vector);
            rat.StartGesture(GameActivity.DOTA_RUN);

            rat_projectile.Target = enemy;
            (rat_projectile.ExtraData! as extra).rat_eid = rat.entindex();
            (rat_projectile.ExtraData! as extra).enemy_eid = enemy.entindex();
            ProjectileManager.CreateTrackingProjectile(rat_projectile);
            target_count--;

            if (target_count <= 0) break;
        }
    }

    /****************************************/

    OnProjectileThink_ExtraData(location: Vector, extraData: extra): void {
        let rat = EntIndexToHScript(extraData.rat_eid!) as CDOTA_BaseNPC;
        rat?.SetAbsOrigin(GetGroundPosition(location, rat));

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
    }

    /****************************************/

    KillRat(id: EntityIndex) {
        let beast = EntIndexToHScript(id);

        if (beast)
            UTIL_Remove(beast)
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