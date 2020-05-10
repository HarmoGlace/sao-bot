const Command = require('../structure/Command');

class Rank extends Command {
    constructor() {
        super('rank', { // id
            aliases: ['rank'],
            args: [
                {
                    id: 'member',
                    type: 'member',
                    default: message => message.member
                }
            ]
        })
    }

    async exec(msg, args) {

        const client = this.client

        const { member } = args;

        const { level, xp } = client.ensureMember(member);

        const {position: {number}} = client.getLeaderboard({member:  member});

        return msg.channel.send({embed: {
                title: 'Niveau',
                description: level,
                fields: [
                    {
                        name: 'Expérience',
                        value: `${xp} (${Math.floor((xp / (level * 25)) * 100)}%)`
                    },
                    {
                        name: 'Position dans le classement',
                        value: client.getPosition(number)
                    }
                ],
                color: 0x4272f5,
                author: {
                    icon_url: member.user.displayAvatarURL(),
                    name: member.displayName
                }
            }})
    }
}

module.exports = Rank;