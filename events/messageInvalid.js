const { Listener } = require('discord-akairo');

class MessageInvalid extends Listener {

    constructor() {
        super('messageInvalid', {
            emitter: 'commandHandler',
            event: 'messageInvalid'
        });
    }

    exec(message) {
        const client = this.client;

        if (message.channel.id === this.client.config.channels.destruction && message.content) {
            client.emit('destructionAction', message)
        }
    }
}

module.exports = MessageInvalid;