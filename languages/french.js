const french = {
    commands: {
        destruction: {
            start: {
                content: (user, villagers, time) => `${user}, attaque commencée. Tu as trouvé un village avec ${villagers} villageois ! Les chevaliers de l'intégrité arriveront dans ${time} !`
            },
            action: {
                spell: (user, spellName, kills, villagers) => `${user}, tu as utilisé le sort **${spellName}** et tué ${kills} villageois. Il en reste ${villagers}`,
                deep_freeze: (user) => `${user}, tu utilises le sort **Deep Freeze**. Pendant 2 minutes tu tueras plus d'humains`,
                attack: (user, kills, villagers) => `${user}, tu as tué ${kills} villageois. Il en reste ${villagers}`
            },
            end: {
                no_point: () => `Fin ! Personne n'a gagné de points :(`,
                points: (points) => `Fin ! Voici les points rapportés:${points}`
            }
        },
        protection: {
            start: {
                content: (user, villagers, time) => `${user}, protection commencée. Tu dois protéger un village avec ${villagers} villageois ! Les ennemis du Dark Territory arriveront dans ${time} !`
            },
            action: {
                spell: (user, spellName, kills, villagers) => `${user}, tu as utilisé le sort **${spellName}** et protégé ${kills} villageois. Il en reste ${villagers}`,
                deep_freeze: (user) => `${user}, tu utilises le sort **Deep Freeze**. Pendant 2 minutes tu protégeras plus d'humains`,
                attack: (user, kills, villagers) => `${user}, tu as protégé ${kills} villageois. Il en reste ${villagers}`
            },
            end: {
                no_point: () => `Fin ! Personne n'a gagné de points :(`,
                points: (points) => `Fin ! Voici les points rapportés:${points}`
            }
        }
    },
    errors: {
        already_launched: user => `${user}, une attaque est déjà en cours !`,
        user_cooldown: (user, reaming) => `${user}, tu dois encore attendre ${reaming} avant de pouvoir utiliser ceci`,
        team_cooldown: (user, teamName, reaming) => `${user}, ta team (${teamName}) doit encore attendre ${reaming} avant de pouvoir utiliser cette commande`,
        competitionDisabled: user => `Désolé ${user}, mais c'est désactivé !`,
        missingPermission: user => `Désolé ${user}, mais tu n'as pas la permission de faire cette commande`,
        need_one_team: user => `Désolé ${user}, mais tu dois être dans une équipe !`,
        need_teams: (user, teams) => `Désolé ${user}, mais tu dois faire partie de l'une des équipes suivantes : ${teams}`,
        wrong_channel: (user, channel) => `${user}, tu dois faire cela dans ${channel}`,
        wrong_channels: (user, channels) => `${user}, tu dois faire cela dans l'un des channels suivant : ${channels}`
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