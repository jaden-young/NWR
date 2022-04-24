import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

interface SaiInnate extends CDOTABaseAbility
{
    ApplyDebuff(target: CDOTA_BaseNPC): void;
}

interface extra
{
    snake_eid?: EntityIndex;
    create_puddle?: boolean | number;
}

@registerAbility()
export class sai_snake_entanglement extends BaseAbility
{
    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle", "particles/units/heroes/sai/sai_snake_entanglement.vpcf", context);
        PrecacheResource("particle", "particles/units/heroes/sai/sai_snake_entanglement_pit.vpcf", context);
        PrecacheResource("particle", "particles/units/heroes/sai/sai_snake_entanglement_impact.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/sai/game_sounds_sai.vsndevts", context);
        //PrecacheResource("soundfile", "soundevents/heroes/sai/game_sounds_vo_sai.vsndevts", context);
    }

    /****************************************/

    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }

    /****************************************/
   
    OnSpellStart(): void {
        let position = this.GetCursorPosition();
        let projectiles = this.GetSpecialValueFor("snake_projectiles");
        let duration = this.GetSpecialValueFor("snake_speed") / (position - this.GetCaster().GetAbsOrigin() as Vector).Length2D();
        this.InitiateLaunch(position, projectiles, duration);
        this.LaunchMainSnake(position)

    }

    /****************************************/

    InitiateLaunch(position: Vector, count: number, duration: number): void {
        this.LaunchSnake(position + RandomVector(this.GetSpecialValueFor("radius") / 2) as Vector, duration, false);
        count--;

        if (count > 0) this.InitiateLaunch(position, count, duration);
    }

    /****************************************/

    LaunchSnake(position: Vector, duration: number, create_puddle: boolean): void {
        let caster = this.GetCaster();
        let direction = (position - caster.GetAbsOrigin() as Vector).Normalized();
        let speed = create_puddle ? this.GetSpecialValueFor("snake_speed") : (position - caster.GetAbsOrigin() as Vector).Length2D() * duration;

        let spawn_pos = caster.GetAttachmentOrigin(caster.ScriptLookupAttachment("attach_scroll_center")) + direction * 75 + caster.GetRightVector() * 40 as Vector;

        let snake = CreateUnitByName("npc_dota_sai_snake", spawn_pos, false, undefined, undefined, caster.GetTeamNumber());
        snake.AddNewModifier(caster, this, "modifier_sai_snake_entanglement_snake", {duration: -1});
        snake.SetForwardVector((position - caster.GetAbsOrigin() as Vector).Normalized() as Vector);
        snake.StartGesture(GameActivity.DOTA_AMBUSH);

        EmitSoundOn("Hero_Sai.SnakeEntanglement.Cast", snake);


        ProjectileManager.CreateLinearProjectile({
            Ability: this,
            EffectName: "",
            vSpawnOrigin: spawn_pos,
            fDistance: (spawn_pos - position as Vector).Length2D(),
            Source: caster,
            vVelocity: direction * speed as Vector,
            ExtraData: {
                snake_eid: snake.entindex(),
                create_puddle: create_puddle
            }
        });
    }

    /****************************************/

    LaunchMainSnake(position: Vector) {
        let caster = this.GetCaster();
        let direction = (position - caster.GetAbsOrigin() as Vector).Normalized();
        let speed = this.GetSpecialValueFor("snake_speed");
        let spawn_pos = caster.GetAttachmentOrigin(caster.ScriptLookupAttachment("attach_scroll_center")) + direction * 75 + caster.GetRightVector() * 40 as Vector;

        ProjectileManager.CreateLinearProjectile({
            Ability: this,
            EffectName: "",
            vSpawnOrigin: spawn_pos,
            fDistance: (spawn_pos - position as Vector).Length2D(),
            Source: caster,
            vVelocity: direction * speed as Vector,
            ExtraData: {
                create_puddle: true
            }
        });
    }
    
    /****************************************/

    OnProjectileThink_ExtraData(location: Vector, extraData: extra): void {
        if (!extraData.snake_eid) return;
        let snake = EntIndexToHScript(extraData.snake_eid!) as CDOTA_BaseNPC;
        snake?.SetAbsOrigin(GetGroundPosition(location, snake) + Vector(0, 0, 75) as Vector);
    }

    /****************************************/

    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, extraData: extra): boolean | void {
        let caster = this.GetCaster();
        
        if (extraData.snake_eid) {
            let snake = EntIndexToHScript(extraData.snake_eid!);
            if (snake) UTIL_Remove(snake);

            
        }

        if (extraData.create_puddle == 1) {
            CreateModifierThinker(caster, this, "modifier_sai_snake_entanglement", {duration: this.GetSpecialValueFor("duration")}, location, caster.GetTeamNumber(), false);
            EmitSoundOnLocationWithCaster(location, "Hero_Sai.SnakeEntanglement.Impact", caster);

            let impact_fx = ParticleManager.CreateParticle("particles/units/heroes/sai/sai_snake_entanglement_impact.vpcf", ParticleAttachment.CUSTOMORIGIN, undefined)
            ParticleManager.SetParticleControl(impact_fx, 1, GetGroundPosition(location, undefined));
            ParticleManager.ReleaseParticleIndex(impact_fx)
        }
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
        let parent = this.GetParent();
        let pos = GetGroundPosition(parent.GetAbsOrigin(), undefined);
        pos.z = pos.z + 150;

        this.radius = ability!.GetSpecialValueFor("radius");
        this.debuff_duration = ability!.GetSpecialValueFor("debuff_duration");

        let pit_fx = ParticleManager.CreateParticle("particles/units/heroes/sai/sai_snake_entanglement_pit.vpcf", ParticleAttachment.ABSORIGIN, parent);
        ParticleManager.SetParticleControl(pit_fx, 0, pos);
        ParticleManager.SetParticleControl(pit_fx, 1, Vector(this.radius, this.radius/40, 1));
        ParticleManager.SetParticleControl(pit_fx, 2, Vector(this.GetRemainingTime(), 0, 0));
        this.AddParticle(pit_fx, false, false, -1, false, false);

        let area_fx = ParticleManager.CreateParticle("particles/units/heroes/sai/sai_snake_entanglement.vpcf", ParticleAttachment.ABSORIGIN, parent)
		ParticleManager.SetParticleControl(area_fx, 1, Vector(this.radius, 0, 0))
		this.AddParticle(area_fx, false, false, -1, false, false)
        
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
        return "particles/units/heroes/sai/sai_snake_entanglement_debuff.vpcf"
    }

    /****************************************/

    GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.ABSORIGIN_FOLLOW
    }
}

@registerModifier()
export class modifier_sai_snake_entanglement_snake extends BaseModifier
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