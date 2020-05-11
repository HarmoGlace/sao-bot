const { Listener } = require('discord-akairo');

class LevelError extends Listener {

    constructor() {
        super('levelError', {
            emitter: 'client',
            event: 'levelError'
        });
    }

    async exec(message, command, needed, level) {
        const client = this.client;

        return message.channel.send(`${message.author}, tu dois être niveau ${needed} pour faire cette commande`);

    }
}

module.exports = LevelError;