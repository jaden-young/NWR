export {}
declare global {
    interface Music {
        PlayGameMusic(gameState: GameState): void;
    }
    var Music: Music
}
