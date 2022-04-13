import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class sakura_mystical_palm_technique extends BaseAbility {

    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle",  "particles/units/heroes/sakura/sakura_mystical_palm_technique.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/sakura/game_sounds_sakura.vsndevts", context);
        //PrecacheResource("soundfile", "soundevents/heroes/sakura/game_sounds_vo_sakura.vsndevts", context);
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();
        let target = this.GetCursorTarget();
        let base_heal = this.GetSpecialValueFor("base_heal");
        let max_hp_heal = this.GetSpecialValueFor("max_hp_heal");

        let total = math.floor(base_heal + target!.GetMaxHealth() * max_hp_heal / 100);

        target?.HealWithParams(total, this, false, true, caster, false);
        target?.Purge(false, true, false, true, true);

        let heal_fx = ParticleManager.CreateParticle("particles/units/heroes/hero_oracle/oracle_purifyingflames_hit.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, target);
        ParticleManager.ReleaseParticleIndex(heal_fx);
        EmitSoundOn("Hero_Sakura.MysticalPalm.Heal", target!);

        let heal_amount_fx = ParticleManager.CreateParticleForTeam("particles/msg_fx/msg_heal.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, target, caster.GetTeamNumber());
        ParticleManager.SetParticleControl(heal_amount_fx, 1, Vector(0, total, 0))
        ParticleManager.SetParticleControl(heal_amount_fx, 2, Vector(2, total.toString().length + 1, 0))
        ParticleManager.SetParticleControl(heal_amount_fx, 3, Vector(0, 255, 0))
        ParticleManager.ReleaseParticleIndex(heal_amount_fx)
    }
}