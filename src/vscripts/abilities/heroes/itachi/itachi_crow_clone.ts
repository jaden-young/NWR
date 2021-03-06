import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../../../lib/dota_ts_adapter"

interface CDOTA_BaseNPC_Hero_Clone
{
    is_clone?: boolean;
}

@registerAbility()
export class itachi_crow_clone extends BaseAbility
{
    clone?: CDOTA_BaseNPC_Hero;
    default_pos: Vector = Vector(25000, -25000 , 0);

    /****************************************/

    Precache(context: CScriptPrecacheContext): void{
        PrecacheResource("particle", "particles/units/heroes/itachi/ephemeral.vpcf", context);
        PrecacheResource("soundfile", "soundevents/heroes/itachi/game_sounds_itachi.vsndevts", context);
        //PrecacheResource("soundfile", "soundevents/heroes/itachi/game_sounds_vo_itachi.vsndevts", context);
    }

    /****************************************/

    Spawn(): void {
        if (!IsServer()) return;
        let ability = this;
        if (ability == undefined || ability.IsNull()) return;
        let caster = this.GetCaster();

        Timers.CreateTimer(FrameTime(), () => {
            if (ability != undefined && !ability.IsNull() && caster != undefined && !caster.IsNull() && !(caster as CDOTA_BaseNPC_Hero_Clone).is_clone) {
                this.SpawnDefferedClone()
            }
        });
    }

    /****************************************/

    OnSpellStart(): void {
        if (this.clone && !this.clone.IsNull() && this.clone.IsAlive()) {
            this.UpdateClone(this.clone);
            this.FinishCreation(this.clone);
        } else {
            this.SpawnCloneInstantly();
        }
    }

    /****************************************/

    SpawnDefferedClone() {
        let caster = this.GetCaster();

        this.clone = CreateUnitByName(
            caster.GetUnitName(),
            this.default_pos,
            false,
            caster,
            caster,
            caster.GetTeamNumber()
        ) as CDOTA_BaseNPC_Hero;

        this.clone.StartGesture(GameActivity.DOTA_RUN);
        this.clone.AddNewModifier(caster, this, "modifier_itachi_crow_clone_deffered", {duration: -1});
        this.SetupClone(this.clone);
    }

    /****************************************/

    SpawnCloneInstantly() {
        let caster = this.GetCaster();
        this.SetupClone(
            CreateUnitByName(
                caster.GetUnitName(),
                caster.GetAbsOrigin(),
                false,
                caster,
                caster,
                caster.GetTeamNumber()
        ) as CDOTA_BaseNPC_Hero);
    }    

    /****************************************/

    SetupClone(clone: CDOTA_BaseNPC_Hero) {
        let caster = this.GetCaster();

        (clone as CDOTA_BaseNPC_Hero_Clone).is_clone = true;
        clone.MakeIllusion();

        while (clone.GetLevel() < caster.GetLevel())
            clone.HeroLevelUp(false);
        clone.SetAbilityPoints(0);

        for (let i = 0; i < caster.GetAbilityCount(); i++) {
			let ability = caster.GetAbilityByIndex(i);
            let clone_ability = clone.GetAbilityByIndex(i);

			if (ability && clone_ability)
                clone_ability.SetLevel(ability.GetLevel());
        }

        for (let j = 0; j <= InventorySlot.SLOT_6; j++) {
            let item = clone.GetItemInSlot(j);
            if (item) clone.RemoveItem(item);

            item = caster.GetItemInSlot(j);
            if (item) {
                clone.AddItemByName(item.GetName());
            }
        }

        let neutral_item = caster.GetItemInSlot(InventorySlot.NEUTRAL_SLOT);
        if (neutral_item) clone.AddItemByName(neutral_item.GetName());

        clone.SetHealth(caster.GetHealth());
        clone.SetMana(caster.GetMana());
    }

    /****************************************/

    UpdateClone(clone: CDOTA_BaseNPC_Hero) {
        let caster = this.GetCaster();

        while (clone.GetLevel() < caster.GetLevel())
            clone.HeroLevelUp(false);
        clone.SetAbilityPoints(0);

        for (let j = 0; j <= InventorySlot.SLOT_6; j++) {
            let item = clone.GetItemInSlot(j);
            if (item) clone.RemoveItem(item);

            item = caster.GetItemInSlot(j);
            if (item) {
                clone.AddItemByName(item.GetName());
            }
        }

        let neutral_item = caster.GetItemInSlot(InventorySlot.NEUTRAL_SLOT);
        if (neutral_item) clone.AddItemByName(neutral_item.GetName());

        clone.SetHealth(caster.GetHealth());
        clone.SetMana(caster.GetMana());
    }

    /****************************************/

    FinishCreation(clone: CDOTA_BaseNPC) {
        let caster = this.GetCaster() as CDOTA_BaseNPC_Hero;
        let invis_duration = this.GetSpecialValueFor("invis_duration");
        let clone_duration = this.GetSpecialValueFor("clone_duration");
        let frame_delay_count = 2

        clone.SetForwardVector(caster.GetForwardVector());
        clone.SetControllableByPlayer(caster.GetPlayerID(), true);
        clone.SetAbsOrigin(caster.GetAbsOrigin());

        if (!caster.IsMoving()) frame_delay_count = 1;

        clone.RemoveModifierByName("modifier_itachi_crow_clone_deffered");

        ExecuteOrderFromTable({
            OrderType: UnitOrder.MOVE_TO_POSITION,
            UnitIndex: clone.entindex(),
            Position: clone.GetAbsOrigin() + clone.GetForwardVector() * 800 as Vector,
            Queue: false
        })

        clone.AddNewModifier(caster, this, "modifier_itachi_crow_clone_illusion", {duration: clone_duration});

        Timers.CreateTimer(FrameTime() * frame_delay_count, () => {
            caster.AddNewModifier(caster, this, "modifier_itachi_crow_clone", {duration: invis_duration});
            EmitSoundOnLocationForAllies(caster.GetAbsOrigin(), "DOTA_Item.InvisibilitySword.Activate", caster);
        });

        this.SpawnDefferedClone();
    }
}

@registerModifier()
export class modifier_itachi_crow_clone extends BaseModifier
{
    move_speed?: number;

    /****************************************/

    OnCreated(params: object): void {
        this.move_speed = this.GetAbility()!.GetSpecialValueFor("bonus_move_speed") + this.GetCaster()!.FindTalentValue("special_bonus_itachi_4");
    }

    /****************************************/

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.INVISIBLE]: true,
            [ModifierState.NO_UNIT_COLLISION]: true
        };
    }

    /****************************************/

    DeclareFunctions(){ return [
        ModifierFunction.ON_ATTACK_LANDED,
        ModifierFunction.ON_ABILITY_EXECUTED,
        ModifierFunction.MOVESPEED_BONUS_PERCENTAGE,
        ModifierFunction.INVISIBILITY_LEVEL,
    ]}

    /****************************************/

    GetModifierMoveSpeedBonus_Percentage(): number {
        return this.move_speed!;
    }

    /****************************************/

    GetModifierInvisibilityLevel(): number {
        return 1
    }

    /****************************************/

    OnAttackLanded(event: ModifierAttackEvent): void {
        if (!IsServer()) return;
        
        if (event.attacker != this.GetParent()) return;

        this.Destroy();
    }

    /****************************************/
    
    OnAbilityExecuted(event: ModifierAbilityEvent): void {
        if (!IsServer()) return;

        if (event.unit != this.GetParent()) return;

        this.Destroy();
    }
}

@registerModifier()
export class modifier_itachi_crow_clone_illusion extends BaseModifier
{
    outgoing_damage?: number;
    fear_radius?: number;
    fear_duration?: number;

    /****************************************/

    IsHidden(): boolean {
        if (IsServer()) return true;
        return GetLocalPlayerTeam(GetLocalPlayerID()) != this.GetParent().GetTeamNumber();
    }

    /****************************************/

    OnCreated(params: object): void {
        if (!IsServer()) return;
        let parent = this.GetParent();
        let ability = this.GetAbility() as CDOTABaseAbility;

        this.outgoing_damage = ability.GetSpecialValueFor("outgoing_damage");
        this.fear_radius = ability.GetSpecialValueFor("shard_fear_radius");
        this.fear_duration = ability.GetSpecialValueFor("shard_fear_duration");

        Timers.CreateTimer(1, () =>{
            parent.FadeGesture(GameActivity.DOTA_RUN);
        });
    }

    /****************************************/

    OnDestroy(): void {
        if (!IsServer()) return;

        this.KillClone();
    }

    /****************************************/

    CheckState(): Partial<Record<ModifierState, boolean>> {return {[ModifierState.NO_UNIT_COLLISION]: true}}

    /****************************************/

    DeclareFunctions(){ return [ModifierFunction.TOTALDAMAGEOUTGOING_PERCENTAGE]}

    /****************************************/

    GetModifierTotalDamageOutgoing_Percentage() {
        return this.outgoing_damage! - 100;
    }

    /****************************************/

    KillClone(): void {
        let caster = this.GetCaster();
        let parent = this.GetParent();
        let origin = parent.GetAbsOrigin();
        parent.AddNoDraw();

        let ephemeral_fx = ParticleManager.CreateParticle("particles/units/heroes/itachi/ephemeral.vpcf", ParticleAttachment.CUSTOMORIGIN, undefined);
        ParticleManager.SetParticleControl(ephemeral_fx, 0, parent.GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(ephemeral_fx);
        EmitSoundOnLocationWithCaster(origin, "Hero_Itachi.CrowClone.Death", this.GetCaster()!);
        EmitSoundOnLocationWithCaster(origin, "Hero_Itachi.BlinkLayer", this.GetCaster()!);

        if (parent.IsAlive()) parent.ForceKill(false);

        if (caster?.HasShard()) {
            this.FearEnemies(caster, origin);
        }
    }

    /****************************************/

    FearEnemies(caster: CDOTA_BaseNPC, position: Vector) {
        let enemies = FindUnitsInRadius(
            caster.GetTeamNumber(),
            position,
            undefined,
            this.fear_radius!,
            UnitTargetTeam.ENEMY,
            UnitTargetType.BASIC + UnitTargetType.HERO,
            UnitTargetFlags.NONE,
            FindOrder.ANY,
            false
        )

        enemies.forEach(enemy => {
            enemy.AddNewModifier(caster, this.GetAbility(), "modifier_nevermore_necromastery_fear", {duration: this.fear_duration! * (1 - enemy.GetStatusResistance())});
        });
    }
}

@registerModifier()
export class modifier_itachi_crow_clone_deffered extends BaseModifier
{
    /****************************************/

    IsHidden(): boolean {return true}

    /****************************************/

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.NOT_ON_MINIMAP]: true,
            [ModifierState.INVISIBLE]: true,
            [ModifierState.INVULNERABLE]: true,
            [ModifierState.NO_HEALTH_BAR]: true,
        };
    }
}