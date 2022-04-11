import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

interface kv
{
    cast_id?: number;
}

interface ModifierWithID extends CDOTA_Buff
{
    cast_id_tracker: Partial<Record<number, number>>;
}

interface FlameProjectileInfo
{
    position: Vector,
    range_mult: number
}

@registerAbility()
export class itachi_phoenix_sage_flame extends BaseAbility
{
    center_pos: Vector = Vector(0, 0, 0);
    right_pos: Vector = Vector(0, 0, 0);
    left_pos: Vector = Vector(0, 0, 0);
    mid_center_right_pos: Vector = Vector(0, 0, 0);
    mid_center_left_pos: Vector = Vector(0, 0, 0);
    top_center_right_pos: Vector = Vector(0, 0, 0);
    top_center_left_pos: Vector = Vector(0, 0, 0);
    order = Array.from({length: 12}, (_, i) => i);

    projectiles_info: Record<number, FlameProjectileInfo> = {
        [0]: {position: this.right_pos, range_mult: 0.2},
        [1]: {position: this.left_pos, range_mult: 0.2},
        [2]: {position: this.center_pos, range_mult: 0.25},
        [3]: {position: this.right_pos, range_mult: 0.46875},
        [4]: {position: this.center_pos, range_mult: 0.46875},
        [5]: {position: this.left_pos, range_mult: 0.46875},
        [6]: {position: this.mid_center_right_pos, range_mult: 0.625},
        [7]: {position: this.mid_center_left_pos, range_mult: 0.625},
        [8]: {position: this.right_pos, range_mult: 0.75},
        [9]: {position: this.top_center_right_pos, range_mult: 0.75},
        [10]: {position: this.top_center_left_pos, range_mult: 0.75},
        [11]: {position: this.left_pos, range_mult: 0.75},
    }

    /****************************************/

    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle", "particles/units/heroes/itachi/itachi_phoenix_sage_flame.vpcf", context);
        PrecacheResource("particle", "particles/units/heroes/itachi/itachi_phoenix_sage_flame_layer.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/itachi/game_sounds_vo_itachi.vsndevts", context);
        PrecacheResource("soundfile", "soundevents/heroes/itachi/game_sounds_itachi.vsndevts", context);
    }

    /****************************************/

    OnAbilityPhaseStart(): boolean {
        EmitSoundOn("VO_Hero_Itachi.PhoenixSageFlame.Talk", this.GetCaster());
        return true
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();
        let position = this.GetCursorPosition();
        let count = this.GetSpecialValueFor("projectile_count");
        let origin = caster.GetAbsOrigin();
        let center_dir = (origin - position as Vector).Normalized();


        this.SetupPositions(origin, center_dir, count);

        EmitSoundOn("Hero_Itachi.PhoenixSageFlame.Cast", this.GetCaster());

        let layer_fx = ParticleManager.CreateParticle("particles/units/heroes/itachi/itachi_phoenix_sage_flame_layer.vpcf", ParticleAttachment.ABSORIGIN, caster);
        ParticleManager.SetParticleControlEnt(layer_fx, 1, caster, ParticleAttachment.ABSORIGIN, "attach_mouth", Vector(0, 0, 0), false);
        ParticleManager.ReleaseParticleIndex(layer_fx);
    }

    /****************************************/

    SetupPositions(origin: Vector, center_dir: Vector, count: number) {
        let line_end_pos = origin - center_dir * 800 as Vector;

        this.center_pos = origin + origin * center_dir * 800 as Vector
        this.right_pos = RotatePosition(origin, QAngle(0, -20, 0), line_end_pos);
        this.left_pos = RotatePosition(origin, QAngle(0, 20, 0), line_end_pos);
        this.mid_center_right_pos = RotatePosition(origin, QAngle(0, -15, 0), line_end_pos);
        this.mid_center_left_pos = RotatePosition(origin, QAngle(0, 15, 0), line_end_pos);
        this.top_center_right_pos = RotatePosition(origin, QAngle(0, -7.5, 0), line_end_pos);
        this.top_center_left_pos = RotatePosition(origin, QAngle(0, 7.5, 0), line_end_pos);

        this.UpdateProjectilesInfo(count);
    }

    /****************************************/

    SetupProjectiles(max_count: number, cast_id: number): void {
        let delay = this.GetSpecialValueFor("fire_rate");

        for (let i = 0; i < this.order.length; i++) {
            this.FireProjectile(this.projectiles_info[this.order[i]].position, this.projectiles_info[this.order[i]].range_mult, cast_id, delay * i);
        }
    }

    /****************************************/

    UpdateProjectilesInfo(count: number) {
        this.projectiles_info[0].position = this.right_pos;
        this.projectiles_info[1].position = this.left_pos;
        this.projectiles_info[2].position = this.center_pos;
        this.projectiles_info[3].position = this.right_pos;
        this.projectiles_info[4].position = this.center_pos;
        this.projectiles_info[5].position = this.left_pos;
        this.projectiles_info[6].position = this.mid_center_right_pos;
        this.projectiles_info[7].position = this.mid_center_left_pos;
        this.projectiles_info[8].position = this.right_pos;
        this.projectiles_info[9].position = this.top_center_right_pos;
        this.projectiles_info[10].position = this.top_center_left_pos;
        this.projectiles_info[11].position = this.left_pos;
        this.ShuffleLaunchOrder(count);
    }

    /****************************************/
    
    FireProjectile(position: Vector, distance_mult: number, cast_id: number, delay: number): void {
        Timers.CreateTimer(delay, () => {
            let caster = this.GetCaster();
            let range = this.GetCastRange(position, undefined);
            let radius = this.GetSpecialValueFor("proj_radius");

            let direction = position - caster.GetAbsOrigin() as Vector;
            direction.z = 0;
            direction = direction.Normalized();

            ProjectileManager.CreateLinearProjectile({
                Ability: this,
                EffectName: "particles/base_attacks/ranged_tower_bad_linear.vpcf",
                vSpawnOrigin: caster.GetAbsOrigin() + Vector(0, 0, 100) as Vector,
                fDistance: range * distance_mult,
                fStartRadius: radius,
                fEndRadius: radius,
                Source: caster,
                iUnitTargetTeam: UnitTargetTeam.ENEMY,
                iUnitTargetType: UnitTargetType.HERO + UnitTargetType.BASIC,
                vVelocity: direction * this.GetSpecialValueFor("speed") as Vector,
                ExtraData: {
                    cast_id: cast_id
                }
            });
        })
    }

    /****************************************/

    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, extraData: kv): boolean | void {
        if (!target) {
            let caster = this.GetCaster();
            let max_hits = this.GetSpecialValueFor("max_hits");
            let duration = this.GetSpecialValueFor("duration");
            let id = extraData.cast_id as number;

            let enemies = FindUnitsInRadius(
                caster.GetTeamNumber(),
                location,
                undefined,
                this.GetSpecialValueFor("proj_radius"),
                UnitTargetTeam.ENEMY,
                UnitTargetType.BASIC + UnitTargetType.HERO,
                UnitTargetFlags.NONE,
                FindOrder.ANY,
                false
            )

            enemies.forEach(enemy => {
                let modifier = enemy.FindModifierByName("modifier_itachi_phoenix_sage_flame") as ModifierWithID;
                if (modifier && modifier.cast_id_tracker[id] && modifier.cast_id_tracker[id]! >= max_hits) return false;
                enemy.AddNewModifier(this.GetCaster(), this, "modifier_itachi_phoenix_sage_flame", {duration: duration, cast_id: extraData.cast_id});
                EmitSoundOn("Hero_Itachi.PhoenixSageFlame.Hit", enemy);
            });
            
            EmitSoundOnLocationWithCaster(location, "Hero_Itachi.PhoenixSageFlame.Impact", this.GetCaster());

            this.DisplayTestingParticles(location);
            return true;
        }

        return false;
    }

    /****************************************/

    DisplayTestingParticles(location: Vector) {
        let a = ParticleManager.CreateParticle("particles/testing_circle.vpcf", ParticleAttachment.WORLDORIGIN, undefined);
        ParticleManager.SetParticleControl(a, 0, location);
        ParticleManager.SetParticleControl(a, 2, Vector(this.GetSpecialValueFor("proj_radius"), 0, 0));
        ParticleManager.ReleaseParticleIndex(a);

        let b = ParticleManager.CreateParticle("particles/testing_circle.vpcf", ParticleAttachment.WORLDORIGIN, undefined);
        ParticleManager.SetParticleControl(b, 0, location);
        ParticleManager.SetParticleControl(b, 1, Vector(0, 0, 0));
        ParticleManager.SetParticleControl(b, 2, Vector(0, 0, 0));
        ParticleManager.ReleaseParticleIndex(b);
    }

    /****************************************/

    ShuffleLaunchOrder(count: number) {
        let i = this.order.length, k, temp;

        while(--i > 0){
            k = Math.floor(Math.random() * (i+1));
            temp = this.order[k];
            this.order[k] = this.order[i];
            this.order[i] = temp;
        }

        this.SetupProjectiles(count, GameRules.GetDOTATime(true, true));
    }
}

@registerModifier()
export class modifier_itachi_phoenix_sage_flame extends BaseModifier implements ModifierWithID
{
    magic_res_reduction?: number;
    move_slow?: number;
    max_hits?: number;
    cast_id_tracker: Partial<Record<number, number>> = {};
    damage_table?: ApplyDamageOptions;

    /****************************************/

    OnCreated(params: kv): void {
        let ability = this.GetAbility()!;

        let damage = ability.GetSpecialValueFor("damage_per_proj");
        this.magic_res_reduction = -ability.GetSpecialValueFor("magic_res_reduction") - this.GetCaster()!.FindTalentValue("special_bonus_itachi_1");
        this.move_slow = -ability.GetSpecialValueFor("move_slow");
        this.max_hits = ability.GetSpecialValueFor("max_hits");

        if (!IsServer()) return;
        this.cast_id_tracker[params.cast_id!] = 1;

        this.SetStackCount(1);
        
        this.damage_table = {
            attacker: this.GetCaster() as CDOTA_BaseNPC,
            victim: this.GetParent(),
            damage: damage,
            damage_type: ability.GetAbilityDamageType(),
            ability: ability
        }

        ApplyDamage(this.damage_table);
    }

    /****************************************/

    OnRefresh(params: kv): void {
        if (!IsServer()) return;
        this.cast_id_tracker[params.cast_id!] ? this.cast_id_tracker[params.cast_id!]!++ : this.cast_id_tracker[params.cast_id!] = 1;

        ApplyDamage(this.damage_table!);
        this.IncrementStackCount();
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.MOVESPEED_BONUS_PERCENTAGE,
        ModifierFunction.MAGICAL_RESISTANCE_BONUS
    ]}


    /****************************************/
    
    GetModifierMoveSpeedBonus_Percentage(): number {
        return this.move_slow! * this.GetStackCount();
    }

    /****************************************/

    GetModifierMagicalResistanceBonus(): number {
        return this.magic_res_reduction! * this.GetStackCount();
    }

    /****************************************/

    GetEffectName(): string {
        return "particles/econ/events/ti10/hot_potato/hot_potato_debuff.vpcf";
    }

    /****************************************/

    GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.ABSORIGIN_FOLLOW;
    }
}