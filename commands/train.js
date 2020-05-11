const Command = require('../structure/Command');

class Daily extends Command {
    constructor() {
        super('train', { // id
            aliases: ['train'],
            neededLevel: 3,
            teamsNeeded: [],
            cooldown: 30000
        })
    }

    async exec(msg, args) {

        const client = this.client

        const xp = client.random(5, 15);

        const member = client.usersDB.math(msg.author.id, '+', xp, 'xp');

        msg.channel.send(`${msg.author}, tu as gagné ${xp} xp`);

        client.updateLevel(msg.member, msg.channel);
    }
}

module.exports = Daily;