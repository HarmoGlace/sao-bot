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
        const language = client.ensureMemberLanguage(msg.member);

        if (channels.length === 1) {
            return msg.channel.send(language.errors.wrong_channel(msg.author, `<#${channels[0]}>`))
        }

        return msg.channel.send(language.errors.wrong_channels(msg.author, `<#${channels.join('>, <#')}>`))

    }
}

module.exports = ChannelError;