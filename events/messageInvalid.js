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

        if (message.channel.id === client.config.channels.destruction && message.content) {
            client.emit('destructionAction', message);
        } else if (message.channel.id === client.config.channels.protection && message.content) {
            client.emit('protectionAction', message);
        }
    }
}

module.exports = MessageInvalid;