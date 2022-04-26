import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class sai_kamis_strength extends BaseAbility {

    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle",  "particles/units/heroes/sai/kami_strength.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/sai/game_sounds_sai.vsndevts", context);
        //PrecacheResource("soundfile", "soundevents/heroes/sai/game_sounds_vo_sai.vsndevts", context);
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();

        caster.AddNewModifier(caster, this, "modifier_sai_kamis_strength", {duration: this.GetSpecialValueFor("duration")});
        
        EmitSoundOn("Hero_Sai.KamisStrength.Cast", caster);
    }
}

@registerModifier()
export class modifier_sai_kamis_strength extends BaseModifier
{
    attack_speed?: number;
    move_speed?: number;

    /****************************************/

    OnCreated(params: Object): void {
        let ability = this.GetAbility()!;

        this.attack_speed = ability.GetSpecialValueFor("attack_speed");
        this.move_speed = ability.GetSpecialValueFor("move_speed");
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.ATTACKSPEED_BONUS_CONSTANT,
        ModifierFunction.MOVESPEED_BONUS_PERCENTAGE
    ]}

    /****************************************/
    
    GetModifierAttackSpeedBonus_Constant(): number {
        return this.attack_speed!;
    }
    
    /****************************************/

    GetModifierMoveSpeedBonus_Percentage(): number {
        return this.move_speed!;
    }

    /****************************************/

    GetEffectName(): string {
        return "particles/units/heroes/sai/kami_strength.vpcf";
    }

    /****************************************/
    
    GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.ABSORIGIN_FOLLOW;
    }
}