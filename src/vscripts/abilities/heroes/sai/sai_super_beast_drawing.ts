import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

interface SaiInnate extends CDOTABaseAbility
{
    ApplyDebuff(target: CDOTA_BaseNPC): void;
}

interface extra
{
    id?: number;
    beast_eid?: EntityIndex;
}

@registerAbility()
export class sai_super_beast_drawing extends BaseAbility
{
    drawing_projectiles: any = {};

    /****************************************/

    Precache(context: CScriptPrecacheContext): void{
        //PrecacheResource("particle", "", context);
        PrecacheResource("soundfile", "soundevents/heroes/sai/game_sounds_sai.vsndevts", context);
        //PrecacheResource("soundfile", "soundevents/heroes/sai/game_sounds_vo_sai.vsndevts", context);
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();
        let origin = caster.GetAbsOrigin();
        let position = origin + (this.GetCursorPosition() - origin as Vector).Normalized() * this.GetEffectiveCastRange(origin, caster) as Vector;
        let id = GameRules.GetDOTATime(true, true);

        this.drawing_projectiles[id] = {};
        
        this.LaunchDrawing(position, id);

        if (caster.HasTalent("special_bonus_sai_6")) {
            this.LaunchDrawing(RotatePosition(origin, QAngle(0, -30, 0), position), id);
            this.LaunchDrawing(RotatePosition(origin, QAngle(0, 30, 0), position), id);
        }
        
        EmitSoundOn("Hero_Sai.SuperBeastDrawing.Cast", caster);
    }

    /****************************************/

    LaunchDrawing(position: Vector, id: number): void {
        let caster = this.GetCaster();
        let distance = this.GetEffectiveCastRange(position, caster);
        let radius = this.GetSpecialValueFor("radius");

        let direction = position - caster.GetAbsOrigin() as Vector;
        direction.z = 0;
        direction = direction.Normalized();

        let spawn_pos = caster.GetAttachmentOrigin(caster.ScriptLookupAttachment("attach_hitloc")) + direction * 75 as Vector;
        spawn_pos.z = GetGroundPosition(spawn_pos, undefined).z;

        let beast = CreateUnitByName("npc_dota_sai_lion", spawn_pos, false, undefined, undefined, caster.GetTeamNumber());
        beast.AddNewModifier(caster, this, "modifier_sai_super_beast_drawing_beast", {duration: -1});
        beast.SetForwardVector(caster.GetForwardVector());
    	beast.FaceTowards(position);
        beast.StartGesture(GameActivity.DOTA_RUN);

        ProjectileManager.CreateLinearProjectile({
            Ability: this,
            EffectName: "particles/units/heroes/hero_grimstroke/grimstroke_darkartistry_proj.vpcf",
            vSpawnOrigin: spawn_pos,
            fDistance: distance,
            fStartRadius: radius,
            fEndRadius: radius,
            Source: caster,
            iUnitTargetTeam: this.GetAbilityTargetTeam(),
            iUnitTargetType: this.GetAbilityTargetType(),
            iUnitTargetFlags: this.GetAbilityTargetFlags(),
            vVelocity: direction * this.GetSpecialValueFor("speed") as Vector,
            ExtraData: {
                id: id,
                beast_eid: beast.entindex()
            }
        });
    }

    OnProjectileThink_ExtraData(location: Vector, extraData: extra): void {
        let beast = EntIndexToHScript(extraData.beast_eid!) as CDOTA_BaseNPC;

        beast?.SetAbsOrigin(GetGroundPosition(location, beast));
    }

    /****************************************/

    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, extraData: extra): boolean | void {
        if (!target) {
            this.KillBeast(extraData.beast_eid!);
            return true;
        }

        if (this.drawing_projectiles[extraData.id as number][target.entindex()]) return false;

        let caster = this.GetCaster();
        let duration = this.GetSpecialValueFor("root_duration");
        let innate = caster.FindAbilityByName("sai_innate_passive") as SaiInnate;
        this.KillBeast(extraData.beast_eid!);

        if (innate) innate.ApplyDebuff(target);

        ApplyDamage({
            attacker: caster,
            victim: target,
            damage: this.GetSpecialValueFor("damage"),
            damage_type: this.GetAbilityDamageType(),
            ability: this
        })

        target.AddNewModifier(caster, this, "modifier_sai_super_beast_drawing", {duration: duration * (1 - target.GetStatusResistance())});
        this.drawing_projectiles[extraData.id as number][target.entindex()] = true;

        EmitSoundOn("Hero_Sai.SuperBeastDrawing.Impact", target);
        return true;
    }

    /****************************************/

    KillBeast(id: EntityIndex) {
        let beast = EntIndexToHScript(id);

        if (beast)
            UTIL_Remove(beast)
    }
}

@registerModifier()
export class modifier_sai_super_beast_drawing extends BaseModifier
{
    IsPurgable(): boolean       {return true}

    /****************************************/

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.ROOTED]: true,
            [ModifierState.DISARMED]: true
        };
    }

    /****************************************/

    GetEffectName(): string {
        return "particles/units/heroes/hero_snapfire/hero_snapfire_disarm.vpcf";
    }

    /****************************************/
    
    GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.OVERHEAD_FOLLOW;
    }
}

@registerModifier()
export class modifier_sai_super_beast_drawing_beast extends BaseModifier
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

