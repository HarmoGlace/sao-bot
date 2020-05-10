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

        if (client.config.ignoredXpChannels.includes(message.channel.id)) return;

        client.updateLeaderboardRoles();

        const newXp = client.config.limitedXpChannels.includes(message.channel.id) ? 1 : client.random(1, 5);

        const { xp, level } = client.ensureMember(message.member);

        client.usersDB.math(message.author.id, '+', newXp, 'xp');

        while (client.usersDB.get(message.author.id, 'xp') >= client.usersDB.get(message.author.id, 'level') * 25) {

            const toRemove = client.usersDB.get(message.author.id, 'level') * 25;

            client.usersDB.math(message.author.id, "-", toRemove, "xp");

            client.usersDB.math(message.author.id, "+", 1, "level");

            const niveau = client.usersDB.get(message.author.id, "level");
            const points = niveau * 35 * client.othersDB.get("boost");

            client.usersDB.math(message.author.id, "+", points, "points");

            const team = client.getMemberTeam(message.member);

            if (!team) return;

            team.points.add(points);



            message.channel.send(`${message.author}, tu es désormais niveau ${niveau}. Tu as rapporté ${points} à ton équipe`);
        }
    }
}

module.exports = MessageInvalid;