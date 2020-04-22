const { Listener } = require('discord-akairo');

class AlreadyLaunchedError extends Listener {

    constructor() {
        super('alreadyLaunchedError', {
            emitter: 'commandHandler',
            event: 'alreadyLaunchedError'
        });
    }

    exec(msg, command) {
        const client = this.client;

        return msg.channel.send(`${msg.author}, une partie est déjà en cours !`)
    }
}

module.exports = AlreadyLaunchedError;