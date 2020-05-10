const french = {
    commands: {
        destruction: {
            start: {
                content: (user, villagers, time) => `${user}, attaque commencée. Tu as trouvé un village de ${villagers} villageois ! Les chevaliers de l'intégrité arriveront dans ${time} !`,
                title: 'Explication du fonctionnement du jeu',
                explenation: 'Vous et votre équipe devez protéger les villageois de ce village. Vous pouvez utiliser ``attack`` pour en tuer quelques uns ou les sorts (liste disponible dans les messages épinglés). Lorsque la limite de temps sera dépassée la partie sera terminée ; vous devez tuer les villageois avant que les chevaliers de l\'intégrité n\'arrivent. Bonne chance, que le bon coté gagne !'
            },
            action: {
                spell: (user, spellName, kills, villagers) => `${user}, tu as utilisé le sort **${spellName}** et tué ${kills} villageois. Il en reste ${villagers}`,
                deep_freeze: (user) => `${user}, tu utilises le sort **Deep Freeze**. Pendant 2 minutes tu tueras plus d'humains`,
                attack: (user, kills, villagers) => `${user}, tu as tué ${kills} villageois. Il en reste ${villagers}`
            },
            end: {
                no_point: () => `Personne n'a gagné de points :(`,
                points: (points) => `Bravo, vous avez gagné ! Voici les points rapportés:${points}`,
                timeout: (points) => `Les chevaliers de l'intégrité sont arrivés, vous avez perdu ! Voici les points rapportés:${points}`
            }
        },
        protection: {
            start: {
                content: (user, villagers, time) => `${user}, protection commencée. Tu dois protéger un village de ${villagers} villageois ! Les troupes du Dark Territory arriveront dans ${time} !`,
                title: 'Explication du fonctionnement du jeu',
                explenation: 'Vous et votre équipe devez protéger les villageois de ce village. Vous pouvez utiliser ``protect`` pour en protéger quelques uns ou les sorts (liste disponible dans les messages épinglés). Lorsque la limite de temps sera dépassée la partie sera terminée ; vous devez protéger les villageois avant que les troupes du Dark Territory n\'arrivent. Bonne chance, que le bon coté gagne !'
            },
            action: {
                spell: (user, spellName, kills, villagers) => `${user}, tu as utilisé le sort **${spellName}** et protégé ${kills} villageois. Il en reste ${villagers} à protéger`,
                invisibility: (user) => `${user}, tu utilises le sort **Invisibility**. Pendant 2 minutes tu protégeras plus d'humains !`,
                protect: (user, kills, villagers) => `${user}, tu as protégé ${kills} villageois. Il en reste ${villagers}`
            },
            end: {
                no_point: () => `Personne n'a gagné de points :(`,
                points: (points) => `Bravo, vous avez gagné ! Voici les points rapportés :${points}`,
                timeout: (points) => `Les troupes du Dark Territory sont arrivées et vous n'avez pas eu le temps de sauver tous les villageois ! Voici les points rapportés :${points}`
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