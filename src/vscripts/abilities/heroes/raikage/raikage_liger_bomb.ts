import { BaseAbility, BaseModifier, BaseModifierMotionHorizontal, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

interface kv {
	target: EntityIndex;
}

interface LigerBombAbility extends CDOTABaseAbility{
    CastLigerBomb(target: CDOTA_BaseNPC, shard: boolean): void;
}

@registerAbility()
export class raikage_liger_bomb extends BaseAbility {

    Precache(context: CScriptPrecacheContext): void {
        PrecacheResource("particle", "particles/units/heroes/raikage/raikage_liger_bomb_impact.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/raikage/game_sounds_raikage.vsndevts", context);
        PrecacheResource("soundfile", "soundevents/heroes/raikage/game_sounds_vo_raikage.vsndevts", context);
    }

    /****************************************/

    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return this.GetCaster().HasShard() ? this.GetSpecialValueFor("shard_range") : super.GetCastRange(location, target);
    }

    /****************************************/

    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();
        let target = this.GetCursorTarget() as CDOTA_BaseNPC;
        let distance = (caster.GetAbsOrigin() - target.GetAbsOrigin() as Vector).Length2D();

        if (caster.HasShard() && distance > this.GetSpecialValueFor("shard_cast_distance")) {
            caster.AddNewModifier(caster, this, "modifier_raikage_liger_bomb_charge", {duration: -1, target: target?.entindex()})
        } else {
            this.CastLigerBomb(target, false);
        }
    }

    /****************************************/

    CastLigerBomb(target: CDOTA_BaseNPC, shard: boolean): void {
        let caster = this.GetCaster();
        shard ? caster.StartGesture(GameActivity.DOTA_CAST_ABILITY_7) : caster.StartGesture(GameActivity.DOTA_CAST_ABILITY_6);
        
        let origin = target.GetAbsOrigin();
        let knockback_duration = this.GetSpecialValueFor("knockback_duration");

        if (target.TriggerSpellAbsorb(this)) return;

        let kv = {
			center_x: origin.x,
			center_y: origin.y,
			center_z: origin.z,
			should_stun: true, 
			duration: knockback_duration,
			knockback_duration: knockback_duration,
			knockback_distance: 0,
			knockback_height: this.GetSpecialValueFor("knockback_height_tgt"),
		}

        target.AddNewModifier(caster, this, "modifier_knockback", kv);

        origin = caster.GetAbsOrigin();
        kv.center_x = origin.x;
        kv.center_y = origin.y;
        kv.center_z = origin.z;
        kv.should_stun = false;
        kv.knockback_height = this.GetSpecialValueFor("knockback_height_caster");

        caster.AddNewModifier(caster, this, "modifier_knockback", kv);
        caster.AddNewModifier(caster, this, "modifier_raikage_liger_bomb_caster", {duration: knockback_duration});
        

        Timers.CreateTimer(knockback_duration, () => this.FinishCast(target, shard));

        shard ? EmitSoundOn("VO_Hero_Raikage.Drop.Cast", caster) : EmitSoundOn("VO_Hero_Raikage.LigerBomb.Cast", caster);
        EmitSoundOn("Hero_Raikage.LigerBomb.Cast", caster);
    }

    /****************************************/

    FinishCast(target: CDOTA_BaseNPC, shard: boolean): void {
        let caster = this.GetCaster();
        let duration = this.GetSpecialValueFor("stun_duration");
        let shard_duration = this.GetSpecialValueFor("shard_duration");
        let has_shard = caster.HasShard();

        let enemies = FindUnitsInRadius(
            caster.GetTeamNumber(),
            target.GetAbsOrigin(),
            undefined,
            this.GetSpecialValueFor("radius"),
            UnitTargetTeam.ENEMY,
            UnitTargetType.BASIC + UnitTargetType.HERO,
            UnitTargetFlags.NONE,
            FindOrder.ANY,
            false
        );

        let damage_table = {
            attacker: caster,
            victim: caster,
            damage: this.GetSpecialValueFor("damage"),
            damage_type: this.GetAbilityDamageType(),
            ability: this
        }

        enemies.forEach(enemy => {
            if (has_shard) {
                enemy.AddNewModifier(caster, this, "modifier_raikage_liger_bomb", {duration: shard_duration * (1 - target.GetStatusResistance())});
            }
            
            damage_table.victim = enemy;
            ApplyDamage(damage_table);

            enemy.AddNewModifier(caster, this, "modifier_stunned", {duration: duration * (1 - target.GetStatusResistance())});
        });

        EmitSoundOn("Hero_Raikage.LigerBomb.Impact", caster);
        shard ? caster.FadeGesture(GameActivity.DOTA_CAST_ABILITY_7) : caster.FadeGesture(GameActivity.DOTA_CAST_ABILITY_6);

        ParticleManager.ReleaseParticleIndex(
            ParticleManager.CreateParticle("particles/units/heroes/raikage/raikage_liger_bomb_impact.vpcf", ParticleAttachment.ABSORIGIN, target)
        )
    }
}

@registerModifier()
export class modifier_raikage_liger_bomb_charge extends BaseModifierMotionHorizontal
{
    target?: CDOTA_BaseNPC;

    charge_speed?: number;
    shard_cast_distance?: number;

    /****************************************/

    IsPurgable(): boolean       {return false}
    RemoveOnDeath(): boolean    {return true}
    IsHidden(): boolean         {return true}

    /****************************************/

    OnCreated(params: kv): void {
        let ability = this.GetAbility()!;

        this.charge_speed = ability.GetSpecialValueFor("shard_speed");
        this.shard_cast_distance = ability.GetSpecialValueFor("shard_cast_distance");

        if (!IsServer()) return;

        this.target = EntIndexToHScript(params.target) as CDOTA_BaseNPC;

        if (!this.ApplyHorizontalMotionController()) {
            this.Destroy()
            return;
        }
    }

    OnDestroy(): void {
        if (!IsServer()) return;

        this.GetParent().RemoveHorizontalMotionController(this);
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.OVERRIDE_ANIMATION,
    ]}

    /****************************************/

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.NO_UNIT_COLLISION]: true,
            [ModifierState.FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [ModifierState.INVULNERABLE]: true
         };
    }

    /****************************************/

    UpdateHorizontalMotion(parent: CDOTA_BaseNPC, dt: number): void {
        let direction = (this.target!.GetAbsOrigin() - parent.GetAbsOrigin() as Vector).Normalized();

        this.CheckConditions();
        if (this.CheckDistance()) return;

        parent.FaceTowards(this.target!.GetAbsOrigin());
        parent.SetAbsOrigin(parent.GetAbsOrigin() + this.charge_speed! * direction * dt as Vector);
    }

    /****************************************/

    OnHorizontalMotionInterrupted(): void {
        this.Destroy();
    }

    /****************************************/

    GetOverrideAnimation(): GameActivity{
        return GameActivity.DOTA_CHANNEL_ABILITY_6
    }

    /****************************************/

    CheckConditions(): void {
        let parent = this.GetParent();
        if (parent.IsStunned() || parent.IsHexed() || parent.IsRooted() || this.target?.IsNull() || !this.target?.IsAlive()) this.Destroy();
    }

    /****************************************/

    CheckDistance(): boolean {
        let parent = this.GetParent();
        let distance = (parent.GetAbsOrigin() - this.target!.GetAbsOrigin() as Vector).Length2D()

        if (distance <= this.shard_cast_distance!) {
            let parent = this.GetParent();
            let ability = this.GetAbility() as LigerBombAbility;

            parent.RemoveHorizontalMotionController(this);

            if (this.target && !this.target.IsNull() && this.target.IsAlive()) {
                ability.CastLigerBomb(this.target, true);
            }

            this.Destroy()
            return true;
        } else if (distance > 3000) {
            this.Destroy();
            return true;
        }

        return false;
    }   
}

@registerModifier()
export class modifier_raikage_liger_bomb extends BaseModifier
{
    armor_reduction?: number;

    /****************************************/

    IsPurgable(): boolean       {return false}
    RemoveOnDeath(): boolean    {return true}

    /****************************************/

    OnCreated(params: Object): void {
        let parent = this.GetParent();
        let ability = this.GetAbility()!;

        this.armor_reduction = -ability.GetSpecialValueFor("shard_armor_reduction");
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.PHYSICAL_ARMOR_BONUS
    ]}

    /****************************************/
    
    GetModifierPhysicalArmorBonus(): number {
        return this.armor_reduction!;
    }
}

@registerModifier()
export class modifier_raikage_liger_bomb_caster extends BaseModifier
{
    IsPurgable(): boolean   {return false}
    IsHidden(): boolean     {return true}

    /****************************************/

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.COMMAND_RESTRICTED]: true
        };
    }
}