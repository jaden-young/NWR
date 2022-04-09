import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class itachi_ephemeral extends BaseAbility
{
    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle", "particles/units/heroes/itachi/ephemeral.vpcf", context);
        PrecacheResource("particle", "particles/units/heroes/hero_techies/techies_taunt_swing_around_hit_shockwave.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/itachi/game_sounds_itachi.vsndevts", context);
        //PrecacheResource("soundfile", "soundevents/heroes/itachi/game_sounds_vo_itachi.vsndevts", context);
    }

    /****************************************/


    GetCooldown(level: number): number {
        return super.GetCooldown(level) - this.GetCaster()!.FindTalentValue("special_bonus_itachi_2");
    }

    OnSpellStart(): void {
        let caster = this.GetCaster();
        let origin = caster.GetAbsOrigin();
        let position = this.GetCursorPosition();
        let range = this.GetCastRange(origin, undefined);
        let distance = (position - origin as Vector).Length2D();
        let silence_duration = this.GetSpecialValueFor("silence_duration") + caster.FindTalentValue("special_bonus_itachi_3")

        EmitSoundOnLocationWithCaster(origin, "Hero_Itachi.Ephemeral.Cast", caster);
        EmitSoundOnLocationWithCaster(origin, "Hero_Itachi.BlinkLayer", caster);
        
        let ephemeral_fx = ParticleManager.CreateParticle("particles/units/heroes/itachi/ephemeral.vpcf", ParticleAttachment.CUSTOMORIGIN, undefined);
        ParticleManager.SetParticleControl(ephemeral_fx, 0, origin);
        ParticleManager.ReleaseParticleIndex(ephemeral_fx);


        position = distance < range ? position : (position - origin as Vector).Normalized() * range + origin as Vector;
        FindClearSpaceForUnit(caster, position, true)
        ProjectileManager.ProjectileDodge(caster);

        if (caster.HasShard()) this.FearEnemies(caster, origin);
        
        let enemies = FindUnitsInRadius(
            caster.GetTeamNumber(), 
            position, undefined, 
            this.GetSpecialValueFor("radius"),
            UnitTargetTeam.ENEMY,
            UnitTargetType.BASIC + UnitTargetType.HERO,
            UnitTargetFlags.NONE,
            FindOrder.ANY,
            false
        );

        enemies.forEach(enemy => {
            enemy.AddNewModifier(caster, this, "modifier_itachi_ephemeral", {duration: silence_duration * (1 - enemy.GetStatusResistance())});
        });

        ParticleManager.ReleaseParticleIndex(
            ParticleManager.CreateParticle("particles/units/heroes/hero_techies/techies_taunt_swing_around_hit_shockwave.vpcf", ParticleAttachment.ABSORIGIN, caster)
        );
        EmitSoundOn("Hero_Itachi.BlinkLayer", caster);
    }

    FearEnemies(caster: CDOTA_BaseNPC, position: Vector) {
        print(this.GetSpecialValueFor("shard_fear_radius"))
        let duration = this.GetSpecialValueFor("shard_fear_duration")
        let enemies = FindUnitsInRadius(
            caster.GetTeamNumber(),
            position,
            undefined,
            this.GetSpecialValueFor("shard_fear_radius"),
            UnitTargetTeam.ENEMY,
            UnitTargetType.BASIC + UnitTargetType.HERO,
            UnitTargetFlags.NONE,
            FindOrder.ANY,
            false
        )

        enemies.forEach(enemy => {
            print("ayaya")
            enemy.AddNewModifier(caster, this, "modifier_nevermore_necromastery_fear", {duration: duration * (1 - enemy.GetStatusResistance())});
        });
    }

}

@registerModifier()
export class modifier_itachi_ephemeral extends BaseModifier
{
    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.SILENCED]: true,
         };
    }

    /****************************************/

    GetEffectName(): string {
        return "particles/generic_gameplay/generic_silenced.vpcf";
    }

    /****************************************/

    GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.OVERHEAD_FOLLOW;
    }

    /****************************************/

    ShouldUseOverheadOffset(): boolean {
        return true;
    }
}