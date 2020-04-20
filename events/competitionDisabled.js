const { Listener } = require('discord-akairo');

class CompetitionDisabled extends Listener {

    constructor() {
        super('competitionDisabled', {
            emitter: 'commandHandler',
            event: 'competitionDisabled'
        });
    }

    exec(msg, command) {
        const client = this.client;

        return msg.channel.send(`Désolé ${msg.author}, mais c'est désactivé !`);

    }
}

module.exports = CompetitionDisabled;