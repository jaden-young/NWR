import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter";

@registerAbility()
export class gaara_innate_passive extends BaseAbility
{
    OnUpgrade(): void {
        //Should refresh modifier on each upgrade
        this.GetCaster().FindModifierByName(this.GetIntrinsicModifierName())?.ForceRefresh()
    }

    GetIntrinsicModifierName(): string {
        return "modifier_gaara_innate_passive_intrinsic"
    }

    ApplyPocketSandDebuff(target: CDOTA_BaseNPC){
        let duration = this.GetSpecialValueFor("duration_base") + this.GetSpecialValueFor("duration_per_level_bonus")*(this.GetLevel()-1)

        target.AddNewModifier(this.GetCaster(), this, "modifier_gaara_innate_passive_debuff", {duration: duration})
    }
}

@registerModifier()
export class modifier_gaara_innate_passive_intrinsic extends BaseModifier {
    
    parent?: CDOTA_BaseNPC;
    duration?: number;


    IsHidden(): boolean {
        return true
    }

    IsDebuff(): boolean {
        return false
    }

    IsPurgable(): boolean {
        return false
    }

    AllowIllusionDuplicate(): boolean {
        return true
    }

    DeclareFunctions() {
        return [ModifierFunction.ON_ATTACK_LANDED]
    }

    OnCreated(params: object): void {
        const ability = this.GetAbility()
        this.parent = this.GetParent()
    }

    OnRefresh(params: object): void {
        const ability = this.GetAbility()
    }

    OnAttackLanded(event: ModifierAttackEvent) {
        if(event.attacker !== this.parent){return}
        if(event.attacker.GetTeam() === event.target.GetTeam()){return}
        
        (this.GetAbility() as gaara_innate_passive).ApplyPocketSandDebuff(event.target)
    }
}

@registerModifier()
export class modifier_gaara_innate_passive_debuff extends BaseModifier {
    attack_speed_slow?: number;
    vision_reduction_percentage?: number;

    IsPurgable(): boolean {
        return true;
    }

    IsDebuff(): boolean {
        return true
    }

    IsHidden(): boolean {
        return false
    }

    OnCreated(params: object): void {
        const ability = this.GetAbility()
        if(ability){
            this.attack_speed_slow = ability.GetSpecialValueFor("attack_speed_slow_base") + ability.GetSpecialValueFor("attack_speed_slow_per_level_bonus")*(ability.GetLevel()-1)
            this.vision_reduction_percentage = ability.GetSpecialValueFor("vision_reduction_percentage_base")
        }
    }

    OnRefresh(params: object): void {
        const ability = this.GetAbility()
        if(ability){
            this.attack_speed_slow = ability.GetSpecialValueFor("attack_speed_slow_base") + ability.GetSpecialValueFor("attack_speed_slow_per_level_bonus")*(ability.GetLevel()-1)
            this.vision_reduction_percentage = ability.GetSpecialValueFor("vision_reduction_percentage_base")
        }
    }

    DeclareFunctions() {
        return [ModifierFunction.ATTACKSPEED_BONUS_CONSTANT,
                ModifierFunction.BONUS_VISION_PERCENTAGE]
    }

    GetModifierAttackSpeedBonus_Constant(){
        return (this.attack_speed_slow ?? 0) * -1
    }

    GetBonusVisionPercentage(){
        return (this.vision_reduction_percentage ?? 0) * -1
    }
}