const { Listener } = require('discord-akairo');

class MissingPermissions extends Listener {

    constructor() {
        super('missingPermissions', {
            emitter: 'commandHandler',
            event: 'missingPermissions'
        });
    }

    exec(msg, command, type, missing) {
        const client = this.client;

        return msg.channel.send(`Désolé ${msg.author}, mais tu n'as pas la permission de faire cette commande`)

    }
}

module.exports = MissingPermissions;