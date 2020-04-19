const teams = [
    {
        id: 'humain', // Team ID
        name: 'Empire Humain', // Team name
        role: '701455421759684658', // Team role ID
        aliases: ['empire'], // Team name Aliases
        subTeams: [
            {
                id: 'sousteam1', // SubTeam ID
                name: 'Tres Belle team', // SubTeam name
                role: '701108549484281896', // SubTeam role ID
                aliases: [''], // SubTeam name Aliases
            }
        ]
    },
    {
        id: 'dark', // Team ID
        name: 'Dark Territory', // Team name
        role: '701455340624936971', // Team role ID
        aliases: ['dark', 'méchant'], // Team name Aliases
        subTeams: [
            {
                id: 'pugiliste', // SubTeam ID
                name: 'Pugilistes', // SubTeam name
                role: '701513955906027581', // SubTeam role ID
                aliases: [''], // SubTeam name Aliases
            }
        ]
    }
]

module.exports = teams;