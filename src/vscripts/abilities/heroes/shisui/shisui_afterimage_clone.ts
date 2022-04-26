import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"


@registerAbility()
export class shisui_afterimage_clone extends BaseAbility {

    Precache(context: CScriptPrecacheContext): void{
        //PrecacheResource("particle",  "", context);
        PrecacheResource("soundfile", "soundevents/heroes/shisui/game_sounds_shisui.vsndevts", context);
        //PrecacheResource("soundfile", "soundevents/heroes/shisui/game_sounds_vo_shisui.vsndevts", context);
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
        let enemies = FindUnitsInRadius(
            caster.GetTeamNumber(),
            position,
            undefined,
            this.GetSpecialValueFor("radius"),
            this.GetAbilityTargetTeam(),
            this.GetAbilityTargetType(),
            this.GetAbilityTargetFlags(),
            FindOrder.ANY,
            false
        );

        if (enemies.length == 0) return;

        let kv = {
            outgoing_damage: -100,
            incoming_damage: -100,
            duration: 5
        }
        
        let clone = CreateIllusions(caster, caster as CDOTA_BaseNPC_Hero, kv, 1, 0, false, false)[0];
        clone.AddNewModifier(caster, this, "modifier_shisui_afterimage_clone", {duration: 5});
        clone.AddNewModifier(caster, this, "modifier_kill", {duration: 5});
    }
}

@registerModifier()
export class modifier_shisui_afterimage_clone extends BaseModifier
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
         };
    }
}