const Command = require('../structure/Command');

class Leaderboard extends Command {
    constructor() {
        super('leaderboard', { // id
            aliases: ['leaderboard', 'levels', 'classement'],
            needCompetition: true
        })
    }

    async exec(msg, args) {

        const client = this.client;
        const leaderboard = client.getLeaderboard({
            member: msg.member,
            dataName: 'niveau',
            secondData: 'xp',
            dataPosition: 'before'
        });

        const points = client.getLeaderboard({
            member: msg.member,
            data: 'points'
        })

        const kills = client.getLeaderboard({
            member: msg.member,
            data: 'kills'
        })

        let embed = {
            color: 0x4272f5,
            title: 'Classement des plus hauts niveaux du serveur',
            description: leaderboard.content,
            fields: []
        };

        if (leaderboard.position.number >= 10) {
            embed.fields.push({
                name: 'Ta position',
                value: client.getPosition(leaderboard.position.number)
            });
        }

        embed.fields.push({
            name: 'Classement des plus hauts points rapportés du serveur',
            value: points.content
        })

        if (points.position.number >= 10) {
            embed.fields.push({
                name: 'Ta position',
                value: client.getPosition(points.position.number)
            })
        }

        embed.fields.push({
            name: 'Classement des personnes ayant fait le plus de kills',
            value: kills.content
        });

        if (kills.position.number >= 10) {
            embed.fields.push({
                name: 'Ta position',
                value: client.getPosition(kills.position.number)
            });
        }

        return msg.channel.send({embed: embed});

    }
}

module.exports = Leaderboard;