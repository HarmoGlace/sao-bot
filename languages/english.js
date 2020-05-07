const english = {
    commands: {
        destruction: {
            start: {
                content: (user, villagers, time) => `${user}, attack started.  You found a village with ${villagers} villagers !  Integrity Knights will arrive in ${time} !`
            },
            action: {
                spell: (user, spellName, kills, villagers) => `${user}, you used the spell **${spellName}** and killed ${kills} villagers. ${villagers} are left`,
                deep_freeze: (user) => `${user}, you use the spell **Deep Freeze**.  For 2 minutes you will kill more humans`,
                attack: (user, kills, villagers) => `${user}, you killed ${kills} villagers. ${villagers} are left`
            },
            end: {
                no_point: () => `End!  No one has earned points :(`,
                points: (points) => `End!  Here are the points reported: ${points}`
            }
        }
    },
    errors: {
        already_launched: user => `${user}, an attack is already underway !`,
        user_cooldown: (user, reaming) => `${user}, you still have to wait ${reaming} before you can use this`,
        team_cooldown: (user, teamName, reaming) => `${user}, your team (${teamName}) must still wait ${reaming} before being able to use this command`,
        competitionDisabled: user => `Sorry ${user}, but it's disabled!`,
        missingPermission: user => `Sorry ${user}, but you don't have permission to use this command`,
        need_one_team: user => `Sorry ${user}, but you have to be on a team !`,
        need_teams: (user, teams) => `Sorry ${msg.author}, but you must be part of one of the following teams: ${teams}`,
        wrong_channel: (user, channel) => `${user}, you have to do this in ${channel}`,
        wrong_channels: (user, channels) => `${user}, you have to do this in one of the following channels: ${channels}`
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
        name: 'english',
        id: 'english',
        local: 'english'
    }
}

module.exports = english;