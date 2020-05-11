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

        if (client.config.ignoredXpChannels.includes(message.channel.id) || !message.guild || !client.others.get('competition')) return;

        client.updateLeaderboardRoles();

        const newXp = client.config.limitedXpChannels.includes(message.channel.id) ? 1 : client.random(1, 5);

        const { xp, level } = client.ensureMember(message.member);

        client.usersDB.math(message.author.id, '+', newXp, 'xp');

        client.updateLevel(message.member, message.channel);
    }
}

module.exports = MessageInvalid;