interface CustomNetTableDeclarations {
    better_cooldowns_cdr: {
        [unitID: string]: {
            cdr: number;
        };
    };

    kakashi_sharingan_tracker: {
        [PlayerID: string]: {
            last_ability: string;
        };
    };
}
