const { Listener } = require('discord-akairo');

class ChannelError extends Listener {

    constructor() {
        super('channelError', {
            emitter: 'commandHandler',
            event: 'channelError'
        });
    }

    exec(msg, command, channels) {
        const client = this.client;

        if (channels.length === 1) {
            return msg.channel.send(`${msg.author}, tu dois faire cette commande dans <#${channels[0]}>`)
        }

        return msg.channel.send(`${msg.author}, tu dois faire cette commande dans l'un des channels suivant : <#${channels.join('>, <#')}>`)


    }
}

module.exports = ChannelError;