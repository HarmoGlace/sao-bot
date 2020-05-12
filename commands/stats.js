const Command = require('../structure/Command');

class Stats extends Command {
    constructor() {
        super('stats', { // id
            aliases: ['stats'],
            args: [
                {
                    id: 'member',
                    type: 'member',
                    default: message => message.member
                }
            ],
            needCompetition: true
        })
    }

    async exec(msg, args) {

        const client = this.client

        const { member } = args;

        const { points } = client.ensureMember(member);

        const {position: {number}} = client.getLeaderboard({member:  member, data: 'points'});

        return msg.channel.send({embed: {
                title: 'Points',
                description: `${client.spaceNumber(points)} points`,
                fields: [
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

module.exports = Stats;