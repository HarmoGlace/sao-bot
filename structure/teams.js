const teams = [
    {
        id: 'humain', // Team ID
        name: 'Empire Humain', // Team name
        role: '701455421759684658', // Team role ID
        aliases: ['empire'], // Team name Aliases
        subTeams: [
            {
                id: 'alice', // SubTeam ID
                name: 'Escouade Alice', // SubTeam name
                role: '701511190739812452', // SubTeam role ID
                aliases: ['alice'], // SubTeam name Aliases
            },
            {
                id: 'bercouli',
                name: 'Escouade Bercouli',
                role: '701510879107219466',
                aliases: ['bercouli']
            },
            {
                id: 'fanatio',
                name: 'Escouade Fanatio',
                role: '701510923520704603',
                aliases: ['fanatio']
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
            },
            {
                id: 'gobelins',
                name: 'Gobelins',
                role: '701513855179685950',
                aliases: ['gobelin']
            },
            {
                id: 'assassins',
                name: 'Assassins',
                role: '701513979704377403',
                aliases: ['assasin', 'asasin']
            }
        ]
    }
]

module.exports = teams;