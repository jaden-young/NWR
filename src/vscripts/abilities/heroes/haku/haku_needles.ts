import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

@registerAbility()
export class haku_needles extends BaseAbility
{
    Precache(context: CScriptPrecacheContext){
        PrecacheResource("soundfile",  "soundevents/game_sounds_heroes/game_sounds_crystalmaiden.vsndevts", context)
        PrecacheResource("soundfile",  "soundevents/heroes/haku/haku_deathneedle.vsndevts", context)
        PrecacheResource("particle",   "particles/units/heroes/haku/haku_needles", context)
        PrecacheResource("particle",   "particles/units/heroes/hero_legion_commander/legion_commander_odds.vpcf", context)
    }

    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius")
    }

    ProcsMagicStick(): boolean {
        return true
    }

    OnSpellStart(): void {
        if(!IsServer()){return}

        let target_point = this.GetCursorPosition()
        let duration = (this.GetSpecialValueFor("wave_interval") * this.GetSpecialValueFor("wave_count")) + this.GetSpecialValueFor("delay") + 0.1

	    let thinker = CreateModifierThinker(this.GetCaster(), this, "modifier_haku_needles_thinker", {duration: duration}, target_point, this.GetCaster().GetTeamNumber(), false)

	    this.GetCaster().EmitSound("haku_deathneedle")
        //Creates flying vision area
        this.CreateVisibilityNode(target_point, this.GetSpecialValueFor("radius"), duration)
    
    }
}

@registerModifier()
export class modifier_haku_needles_thinker extends BaseModifier
{
    wave_count: number = 0
    delay: number = 0
    damage: number = 0
    vfx: any;

    OnCreated(params: object): void {
        if(!IsServer()){return}
        let ability = this.GetAbility()
        if(!ability){return}
        let caster = ability.GetCaster()
        if(!caster){return}

        this.wave_count = ability.GetSpecialValueFor("wave_count")
        this.damage = ability.GetSpecialValueFor("wave_damage") + caster.FindTalentValue("special_bonus_haku_4")
        this.delay = ability.GetSpecialValueFor("delay")

        // this.OnIntervalThink()
        this.StartIntervalThink(this.delay)
    }

    OnIntervalThink(): void {
        let caster = this.GetCaster()
        if(!caster){return}
        let ability = this.GetAbility()
        if(!ability){return}
        if(this.wave_count === 0){
            this.StartIntervalThink(-1)
            return
        }

        this.wave_count--

        let particleName = "particles/units/heroes/hero_haku/haku_needles_base.vpcf"
        let wave_interval = ability.GetSpecialValueFor("wave_interval")
        let radius = ability.GetSpecialValueFor("radius")

        this.vfx = ParticleManager.CreateParticle( particleName, ParticleAttachment.CUSTOMORIGIN, caster)
        //CP1 - position of caster
        //CP4 - X - radius, Y - thicknes, Z - speed
        //CP5 - number of needles to emit (not sure how exactly it corelates), alpha values for some childs (maybe something else?)
        ParticleManager.SetParticleControl(this.vfx, 0, this.GetParent().GetAbsOrigin())
        ParticleManager.SetParticleControl(this.vfx, 1, caster.GetAbsOrigin())
        ParticleManager.SetParticleControl(this.vfx, 4, Vector(radius,0,0))
        ParticleManager.SetParticleControl(this.vfx, 5, Vector(radius,0,0))

        let units = FindUnitsInRadius(caster.GetTeam(),
                                      this.GetParent().GetAbsOrigin(),
                                      undefined,
                                      radius,
                                      ability.GetAbilityTargetTeam(),
                                      ability.GetAbilityTargetType(),
                                      ability.GetAbilityTargetFlags(),
                                      FindOrder.ANY,
                                      false)
        
        units.forEach((unit) => {
            if(unit.IsBuilding()){return}
            if(!caster){return}
            if(!ability){return}
            ApplyDamage({
                victim: unit,
                attacker: caster,
                damage: this.damage,
                damage_type: ability.GetAbilityDamageType(),
                ability: ability
            })
            let root_duration = ability.GetSpecialValueFor("stun_duration")
            unit.AddNewModifier(caster, ability,"modifier_haku_needles_victim_debuff",{duration: root_duration})
        })

		EmitSoundOnLocationWithCaster(this.GetParent().GetAbsOrigin(), "hero_Crystal.freezingField.explosion", caster)


        this.StartIntervalThink(wave_interval)

    }

    OnDestroy(): void {
        ParticleManager.DestroyParticle(this.vfx, false)
        ParticleManager.ReleaseParticleIndex(this.vfx)
    }
}

@registerModifier()
export class modifier_haku_needles_victim_debuff extends BaseModifier
{
    IsPurgable(): boolean {
        return true
    }

    IsPermanent(): boolean {
        return false
    }

    IsDebuff(): boolean {
        return true
    }

    IsHidden(): boolean {
        return false
    }

    CheckState(){
        return {[ModifierState.ROOTED]: true}
    }

    //TODO: VFX

}