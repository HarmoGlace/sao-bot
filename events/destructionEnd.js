const { Listener } = require('discord-akairo');

class DestructionEnd extends Listener {

    constructor() {
        super('destructionEnd', {
            emitter: 'client',
            event: 'destructionEnd'
        });
    }

    exec(msg, reason) {
        const client = this.client;

        client.othersDB.set('destruction', false, 'started');

        const {villagers: {total, current}} = client.othersDB.get('destruction');

        const ratioTotal = current === 0 ? 100 : total / current * 100;

        const teams = client.othersDB.get('destruction', 'teams');

        teams.sort((a, b) => b.kills - a.kills);

        const pointsTotal = Math.round((ratioTotal / 4) * (total / 4));

        const logs = [];

        for (const {id, kills} of teams) {
            const teamRatio = kills / total;
            const points = Math.round(teamRatio * pointsTotal);
            const team = client.teams.all.get(id);

            team.points.add(points);
            logs.push({team: team, points: points, percentage: (teamRatio * 100).toFixed(1)});
        }

        msg.channel.send(`Fin ! Voici les points rapportés :\n\n\`\`${logs.map(team => `${team.team.name} : ${team.points} points (${team.percentage}%)`).join('``\n```')}\`\``);

        // msg.channel.send(`Les chevaliers de l'intégrité sont arrivés ! Villageois tués : ${ratio}%`)

        client.othersDB.set('destruction', {
            wave: null,
            villagers: {
                total: null,
                current: null
            },
            timeout: null,
            started: false
        })

        if (reason === 'timeout') {



        } else if (reason === 'win') {

        }

    }
}

module.exports = DestructionEnd;