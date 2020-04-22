const french = {
    commands: {

    },
    errors: {
        already_launched: user => `${user}, une attaque est déjà en cours !`,
        user_cooldown: (user, reaming) => `${user}, tu dois encore attendre ${reaming} avant de pouvoir utiliser cette commande`,
        team_cooldown: (user, teamName, reaming) => `${user}, ta team (${teamName}) doit encore attendre ${reaming} avant de pouvoir utiliser cette commande`,
        competitionDisabled: user => `Désolé ${user}, mais c'est désactivé !`,
        missingPermission: user => `Désolé ${user}, mais tu n'as pas la permission de faire cette commande`,
        need_one_team: user => `Désolé ${user}, mais tu dois être dans une équipe !`,
        need_teams: (user, teams) => ``
    },
    time: [
        {
            replace: 'second',
            with: 'seconde'
        },
        {
            replace: 'hour',
            with: 'heure'
        },
        {
            replace: 'day',
            with: 'jour'
        },
        {
            replace: 'year',
            with: 'an'
        }
    ],
    information: {
        name: 'french',
        id: 'french',
        local: 'français'
    }
}

module.exports = french;