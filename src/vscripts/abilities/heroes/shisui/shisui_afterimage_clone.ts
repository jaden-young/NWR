import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

interface AfterimageModifier extends CDOTA_Buff
{
    penalty_status?: boolean;
}

@registerAbility()
export class shisui_afterimage_clone extends BaseAbility {

    clone?: CDOTA_BaseNPC;

    /****************************************/

    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle",  "particles/units/heroes/shisui/shisui_afterimage_clone_slash.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/shisui/game_sounds_shisui.vsndevts", context);
        PrecacheResource("soundfile", "soundevents/heroes/shisui/game_sounds_vo_shisui.vsndevts", context);
    }


    /****************************************/

    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius")
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();
        let position = this.GetCursorPosition();
        let radius = this.GetSpecialValueFor("radius");
        let attack_count = this.GetSpecialValueFor("attack_count") + caster.FindTalentValue("special_bonus_shisui_5");

        let enemies = FindUnitsInRadius(
            caster.GetTeamNumber(),
            position,
            undefined,
            radius,
            this.GetAbilityTargetTeam(),
            this.GetAbilityTargetType(),
            UnitTargetFlags.NO_INVIS + UnitTargetFlags.NOT_ATTACK_IMMUNE + UnitTargetFlags.MAGIC_IMMUNE_ENEMIES,
            FindOrder.ANY,
            false
        );

        if (enemies.length == 0) return;
        this.SetActivated(false);

        let kv = {
            outgoing_damage: -100,
            incoming_damage: -100,
            duration: 5
        }
        
        this.clone = CreateIllusions(caster, caster as CDOTA_BaseNPC_Hero, kv, 1, 0, false, false)[0];
        this.clone.AddNewModifier(caster, this, "modifier_shisui_afterimage_clone_image", {duration: 5});
        this.clone.AddNewModifier(caster, this, "modifier_kill", {duration: 5});
        this.clone.SetForwardVector((position - this.clone.GetAbsOrigin() as Vector).Normalized());


        caster.AddNewModifier(caster, this, "modifier_shisui_afterimage_clone", {duration: -1})

        let heroes = FindUnitsInRadius(
            caster.GetTeamNumber(),
            position,
            undefined,
            radius,
            this.GetAbilityTargetTeam(),
            UnitTargetType.HERO,
            UnitTargetFlags.NO_INVIS + UnitTargetFlags.NOT_ATTACK_IMMUNE + UnitTargetFlags.MAGIC_IMMUNE_ENEMIES,
            FindOrder.ANY,
            false
        );

        EmitSoundOnEntityForPlayer("VO_Hero_Shisui.AfterImage.Cast", caster, caster.GetPlayerOwnerID());

        let enemy = heroes.length > 0 ? heroes[0] : enemies[0];
        this.PerformJump(enemy, attack_count, {} as Record<EntityIndex, boolean>, position, this.GetSpecialValueFor("delay"));
    }

    /****************************************/

    PerformJump(target: CDOTA_BaseNPC | undefined, attack_count: number, affected_enemies: Record<EntityIndex, boolean>, position: Vector, delay: number) {
        let caster = this.GetCaster();
        target = target as CDOTA_BaseNPC;

        let pos = target.GetAbsOrigin() + target.GetForwardVector() * 150 as Vector;
        pos = RotatePosition(target.GetAbsOrigin(), QAngle(0, RandomInt(0, 360), 0), pos);
        
        caster.SetAbsOrigin(pos);
        caster.SetForwardVector((target.GetAbsOrigin() - caster.GetAbsOrigin() as Vector).Normalized());

        caster.StartGestureWithPlaybackRate(GameActivity.DOTA_ATTACK, 1.5); //test
        //caster.StartGesture(GameActivity.DOTA_ATTACK_SPECIAL);

        let modifier = caster.FindModifierByName("modifier_shisui_afterimage_clone") as AfterimageModifier;

        modifier.penalty_status = affected_enemies[target.entindex()] ? true : false;

        Timers.CreateTimer(delay, () => this.AttackTarget(target, attack_count, affected_enemies, position));
    }

    /****************************************/

    AttackTarget(target: CDOTA_BaseNPC | undefined, attack_count: number, affected_enemies: Record<EntityIndex, boolean>, position: Vector): void {
        let caster = this.GetCaster();
        target = target as CDOTA_BaseNPC;

        if (!target.IsInvisible() && !target.IsAttackImmune() && !target.IsInvulnerable()) {
            caster.PerformAttack(target, false, true, true, false, false, false, false);
            ParticleManager.ReleaseParticleIndex(
                ParticleManager.CreateParticle("particles/units/heroes/shisui/shisui_afterimage_clone_slash.vpcf", ParticleAttachment.ABSORIGIN, target)
            )
        }

        attack_count--;
        affected_enemies[target.entindex()] = true;

        if (attack_count > 0) this.FindNextTarget(position, attack_count, affected_enemies);
        else this.StopAfterimage();
    }

    /****************************************/

    FindNextTarget(position: Vector, attack_count: number, affected_enemies: Record<EntityIndex, boolean>) {
        let caster = this.GetCaster();
        let radius = this.GetSpecialValueFor("radius");
        let target: CDOTA_BaseNPC | undefined = undefined;

        let enemies = FindUnitsInRadius(
            caster.GetTeamNumber(),
            position,
            undefined,
            radius,
            this.GetAbilityTargetTeam(),
            this.GetAbilityTargetType(),
            UnitTargetFlags.NO_INVIS + UnitTargetFlags.NOT_ATTACK_IMMUNE + UnitTargetFlags.MAGIC_IMMUNE_ENEMIES,
            FindOrder.ANY,
            false
        );

        let heroes = FindUnitsInRadius(
            caster.GetTeamNumber(),
            position,
            undefined,
            radius,
            this.GetAbilityTargetTeam(),
            UnitTargetType.HERO,
            UnitTargetFlags.NO_INVIS + UnitTargetFlags.NOT_ATTACK_IMMUNE + UnitTargetFlags.MAGIC_IMMUNE_ENEMIES,
            FindOrder.ANY,
            false
        );

        if (enemies.length == 0) {
            this.StopAfterimage();
            return;
        }

        for (let [k, enemy] of Object.entries(heroes)) {
            if (affected_enemies[enemy.entindex()]) continue;
            target = enemy;
            break;
        }

        if (!target) {
            if (heroes.length > 0) target = heroes[RandomInt(0, heroes.length -1)];
            else {
                for (let [k, enemy] of Object.entries(enemies)) {
                    if (affected_enemies[enemy.entindex()]) continue;
                    target = enemy;
                    break;
                }
            }
        }

        target = target ? target : enemies[RandomInt(0, heroes.length -1)];

        this.PerformJump(target, attack_count, affected_enemies, position, this.GetSpecialValueFor("delay"));
    }

    /****************************************/

    StopAfterimage() {
        let caster = this.GetCaster();
        let origin = this.clone!.GetAbsOrigin();
        let forward = this.clone!.GetForwardVector();
        this.clone?.ForceKill(false);

        caster.SetAbsOrigin(origin);
        caster.SetForwardVector(forward);

        caster.RemoveModifierByName("modifier_shisui_afterimage_clone");
        this.SetActivated(true);
    }
}

@registerModifier()
export class modifier_shisui_afterimage_clone extends BaseModifier
{
    damage_penalty?: number;
    penalty_status: boolean = false;

    /****************************************/

    OnCreated(params: object): void {
        if (!IsServer()) return;
        this.damage_penalty = -this.GetParent().GetAverageTrueAttackDamage(undefined) * this.GetAbility()!.GetSpecialValueFor("same_target_penalty") / 100;
    }

    /****************************************/

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.INVULNERABLE]: true,
            [ModifierState.NO_UNIT_COLLISION]: true,
            [ModifierState.UNSELECTABLE]: true,
            [ModifierState.UNTARGETABLE]: true,
            [ModifierState.NO_HEALTH_BAR]: true,
            [ModifierState.DISARMED]: true,
         };
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.PREATTACK_BONUS_DAMAGE
    ]}

    /****************************************/

    GetModifierPreAttack_BonusDamage(): number {
        if (!IsServer()) return 0;
        return this.penalty_status ? this.damage_penalty! : 0;
    }
}

@registerModifier()
export class modifier_shisui_afterimage_clone_image extends BaseModifier
{
    IsHidden(): boolean     {return true}

    /****************************************/

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.CANNOT_BE_MOTION_CONTROLLED]: true,
            [ModifierState.INVULNERABLE]: true,
            [ModifierState.DISARMED]: true,
            [ModifierState.ROOTED]: true,
            [ModifierState.NO_UNIT_COLLISION]: true,
            [ModifierState.UNSELECTABLE]: true,
            [ModifierState.UNTARGETABLE]: true,
            [ModifierState.NO_HEALTH_BAR]: true,
         };
    }
}