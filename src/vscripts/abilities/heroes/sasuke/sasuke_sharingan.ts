import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class sasuke_sharingan extends BaseAbility {

    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle",  "particles/units/heroes/sasuke/sasuke_sharingan_buff.vpcf", context);
        PrecacheResource("particle",  "particles/units/heroes/sasuke/sasuke_sharingan_evade.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/sasuke/game_sounds_sasuke.vsndevts", context);
        //PrecacheResource("soundfile", "soundevents/heroes/sasuke/game_sounds_vo_sasuke.vsndevts", context);
    }

    /****************************************/

    OnSpellStart(): void {
        let caster = this.GetCaster();

        caster.AddNewModifier(caster, this, "modifier_sasuke_sharingan", {duration: this.GetSpecialValueFor("duration")});
        EmitSoundOn("Hero_Sasuke.Sharingan.Cast", caster);
    }
}

@registerModifier()
export class modifier_sasuke_sharingan extends BaseModifier
{
    attack_speed?: number;
    instances?: number;
    min_damage?: number;

    /****************************************/

    IsPurgable(): boolean       {return false}
    RemoveOnDeath(): boolean    {return true}

    /****************************************/

    OnCreated(params: Object): void {
        let ability = this.GetAbility()!;

        this.attack_speed = ability.GetSpecialValueFor("bonus_attack_speed");
        this.instances = ability.GetSpecialValueFor("instances");
        this.min_damage = ability.GetSpecialValueFor("min_damage");

        if (!IsServer()) return;
        this.SetStackCount(this.instances);
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.ATTACKSPEED_BONUS_CONSTANT,
        ModifierFunction.INCOMING_DAMAGE_PERCENTAGE
    ]}

    /****************************************/
    
    GetModifierAttackSpeedBonus_Constant(): number {
        return this.attack_speed!;
    }
    
    /****************************************/

    GetModifierIncomingDamage_Percentage(event: ModifierAttackEvent): number {
        let reduction = 0;

        if (event.damage_type != DamageTypes.HP_REMOVAL && event.damage > this.min_damage! && this.GetStackCount() > 0) {
            reduction = -100;
            this.DecrementStackCount();

            EmitSoundOn("Hero_Sasuke.Sharingan.Dodge", this.GetParent());
            let dodge_fx = ParticleManager.CreateParticle("particles/units/heroes/sasuke/sasuke_sharingan_evade.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, this.GetParent());
            ParticleManager.SetParticleControlForward(dodge_fx, 0, this.GetParent().GetForwardVector());
            Timers.CreateTimer(0.2, () => {
                ParticleManager.DestroyParticle(dodge_fx, false);
                ParticleManager.ReleaseParticleIndex(dodge_fx);
            })
        }
        
        return reduction;
    }

    /****************************************/

    GetEffectName(): string {
        return "particles/units/heroes/sasuke/sasuke_sharingan_buff.vpcf";
    }

    /****************************************/
    
    GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.ABSORIGIN;
    }
}