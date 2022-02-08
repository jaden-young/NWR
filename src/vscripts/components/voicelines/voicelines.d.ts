/**
 * Relies on modifiers/modifier_responses.lua
 */
declare interface VoiceResponses {
    Start(): void
    RegisterUnit(unitName: string, configFile: string): void;
}
declare var VoiceResponses: VoiceResponses;
