import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class hidan_innate_passive extends BaseAbility
{
    ready_vfx?: ParticleID;

    OnUpgrade(): void {
        //Should refresh modifier on eanch upgrade
        this.GetCaster().FindModifierByName(this.GetIntrinsicModifierName())?.ForceRefresh()
    }

    GetIntrinsicModifierName(): string {
        return "modifier_hidan_innate_passive_intrinsic"
    }

    GetCooldown(level: number): number {
        let cooldown_base = this.GetSpecialValueFor("cooldown_base")
        let cooldown_bonus_per_level = this.GetSpecialValueFor("cooldown_bonus_per_level")

        return cooldown_base + (this.GetLevel() - 1) * cooldown_bonus_per_level
    }

    TriggerAbility(){
        let caster = this.GetCaster()
        let hp_to_heal = (this.GetSpecialValueFor("hp_healed_percentage_base") + this.GetSpecialValueFor("hp_healed_percentage_bonus_per_level") * (this.GetLevel() - 1)) * caster.GetMaxHealth() * 0.01
        caster.Heal(hp_to_heal, this)
        this.StartCooldown(this.GetEffectiveCooldown(this.GetLevel()))

        //Effects
        this.RemoveReadyEffect()

        let particle = ParticleManager.CreateParticle("particles/units/heroes/hidan/hidan_passive_a.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, caster)
        ParticleManager.SetParticleControl(particle, 0, caster.GetAbsOrigin())
        ParticleManager.SetParticleControl(particle, 1, caster.GetAbsOrigin()) 
        ParticleManager.SetParticleControl(particle, 3, caster.GetAbsOrigin())

        ParticleManager.DestroyParticle(particle, false)
        ParticleManager.ReleaseParticleIndex(particle)

	    EmitSoundOn("hidan_jashinblessing_proc", caster)

    }

    CreateReadyEffect(){
        let caster = this.GetCaster()
        this.ready_vfx = ParticleManager.CreateParticle("particles/units/heroes/hidan/hidan_passive_ready_a.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, caster)
        ParticleManager.SetParticleControlEnt(this.ready_vfx, 3, caster, ParticleAttachment.ABSORIGIN_FOLLOW, "attach_origin", caster.GetAbsOrigin(), true)
    }

    RemoveReadyEffect(){
        if(this.ready_vfx){
            ParticleManager.DestroyParticle(this.ready_vfx, false)
            ParticleManager.ReleaseParticleIndex(this.ready_vfx)
        }
    }
}

@registerModifier()
export class modifier_hidan_innate_passive_intrinsic extends BaseModifier{

    IsDebuff(): boolean {
        return false
    }

    IsHidden(): boolean {
        return true
    }

    OnCreated(params: object): void {
        let ability = this.GetAbility()
        let caster = ability?.GetCaster()

        if(ability?.IsCooldownReady()){
            (ability as hidan_innate_passive)?.CreateReadyEffect()
        }else{
            this.StartIntervalThink(ability?.GetCooldownTimeRemaining() ?? -1)
        }
    }

    DeclareFunctions() {
        return [
            ModifierFunction.ABSOLUTE_NO_DAMAGE_PHYSICAL,
            ModifierFunction.ABSOLUTE_NO_DAMAGE_PURE,
            ModifierFunction.ABSOLUTE_NO_DAMAGE_MAGICAL
        ]
    }

    OnIntervalThink(): void {
        (this.GetAbility() as hidan_innate_passive).CreateReadyEffect()
        this.StartIntervalThink(-1)
    }

    IsDamageDeadly(damage: number){
        return this.GetParent().GetHealth() <= damage
    }

    GetAbsolutelyNoDamage(event: ModifierAttackEvent) : 0 | 1{
        
        if(event.target === this.GetParent()){
            if(this.IsDamageDeadly(event.damage) && !this.GetParent().PassivesDisabled() && this.GetAbility()?.IsCooldownReady()){
                (this.GetAbility() as hidan_innate_passive)?.TriggerAbility()
                if(IsServer()){
                    this.StartIntervalThink(this.GetAbility()?.GetCooldownTimeRemaining() ?? -1)
                    print(this.GetAbility()?.GetCooldownTimeRemaining())
                }
                return 1
            } else{
                return 0
            }
        }
        return 0
    }


    GetAbsoluteNoDamagePhysical(event: ModifierAttackEvent){
        return this.GetAbsolutelyNoDamage(event)
    }

    GetAbsoluteNoDamageMagical(event: ModifierAttackEvent){
        return this.GetAbsolutelyNoDamage(event)

    }

    GetAbsoluteNoDamagePure(event: ModifierAttackEvent){
        return this.GetAbsolutelyNoDamage(event)
    }

}
