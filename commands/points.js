const Command = require('../structure/Command');

class Points extends Command {
    constructor() {
        super('points', { // id
            aliases: ['points', 'point'],
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    id: 'args',
                    type: 'string',
                    match: 'separate'
                }
            ]
        })
    }

    async exec(msg, argsList) {

        const client = this.client;

        const syntax = 'Voici la syntaxe de la commande : ``!points <add/remove/set> <team> <nombre> [raison]``';

        const typeList = ['add', 'remove', 'set'];

        if (!argsList || !argsList.args || !typeList.includes(argsList.args[0].toLowerCase())) return msg.channel.send(`${msg.author}, spécifie un type d'action. ${syntax}`);

        const { args } = argsList;
        let [type, teamResolvable, number, ...reason] = args;

        type = type.toLowerCase();

        if (!teamResolvable) return msg.channel.send(`${msg.author}, spécifie une team. ${syntax}`);

        const team = client.teams.resolve(teamResolvable);

        if (!team) return msg.channel.send(`${msg.author}, la team est invalide. ${syntax}`);

        if (!number || isNaN(number)) return msg.channel.send(`${msg.author}, spécifie un nombre valide. ${syntax}`);

        const points = parseInt(number);

        if (!reason) reason = 'Aucune raison spécifiée'
        else reason = reason.join(' ')

        if (type === 'add') {
            team.points.add(points);
        } else if (type === 'remove') {
            team.points.remove(points);
        } else if (type === 'set') {
            team.points.set(points);
        }

        client.updatePoints();

        return msg.channel.send(`**${client.spaceNumber(points)}** points ont été ${type} à la team ${team.name}. Raison : \`\`${reason}\`\``)
    }
}

module.exports = Points;