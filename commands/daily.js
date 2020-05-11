const Command = require('../structure/Command');
const ms = require('ms');

class Daily extends Command {
    constructor() {
        super('daily', { // id
            aliases: ['daily'],
            neededLevel: 3,
            teamsNeeded: [],
            cooldown: ms('1d')
        })
    }

    async exec(msg, args) {

        const client = this.client

        const team = client.getMemberTeam(msg.member);
        team.points.add(500);

        return msg.channel.send(`${msg.author}, tu as fait gagner 500 points à ton équipe !`)
    }
}

module.exports = Daily;