import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class yondaime_yellow_flash extends BaseAbility {

    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle",  "particles/units/heroes/yondaime/yondaime_yellow_flash.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/yondaime/game_sounds_yondaime.vsndevts", context);
        //PrecacheResource("soundfile", "soundevents/heroes/yondaime/game_sounds_vo_yondaime.vsndevts", context);
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();

        caster.AddNewModifier(caster, this, "modifier_yondaime_yellow_flash", {duration: this.GetSpecialValueFor("duration")});
        EmitSoundOn("Hero_yondaime.YellowFlash.Cast", caster);
    }
}

@registerModifier()
export class modifier_yondaime_yellow_flash extends BaseModifier
{
    move_speed?: number;
    evasion?: number;

    /****************************************/

    IsPurgable(): boolean       {return false}
    RemoveOnDeath(): boolean    {return true}

    /****************************************/

    OnCreated(params: Object): void {
        let ability = this.GetAbility()!;

        this.move_speed = ability.GetSpecialValueFor("move_speed");
        this.evasion = ability.GetSpecialValueFor("evasion");
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.MOVESPEED_BONUS_PERCENTAGE,
        ModifierFunction.EVASION_CONSTANT,
        ModifierFunction.IGNORE_MOVESPEED_LIMIT
    ]}

    /****************************************/
    
    GetModifierMoveSpeedBonus_Percentage(): number {
        return this.move_speed!;
    }
    
    /****************************************/

    GetModifierEvasion_Constant(): number {
        return this.evasion!;
    }

    /****************************************/

    GetModifierIgnoreMovespeedLimit(): 1 | 0 {
        return 1;
    }

    /****************************************/

    GetEffectName(): string {
        return "particles/units/heroes/yondaime/yondaime_yellow_flash.vpcf";
    }

    /****************************************/
    
    GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.ABSORIGIN;
    }
}