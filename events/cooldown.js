const { Listener } = require('discord-akairo');

class Cooldown extends Listener {

    constructor() {
        super('cooldown', {
            emitter: 'commandHandler',
            event: 'cooldown'
        });
    }

    exec(msg, command, reaming, type, team) {
        const client = this.client;
        reaming = client.getTime(reaming);

        if (type === 'user') {
            return msg.channel.send(`${msg.author}, tu dois encore attendre ${reaming} avant de pouvoir utiliser cette commande`)
        } else if (type === 'subTeam' || type === 'parentTeam') {
            return msg.channel.send(`${msg.author}, ta team (${team.name}) doit encore attendre ${reaming} avant de pouvoir utiliser cette commande`)
        }

    }
}

module.exports = Cooldown;