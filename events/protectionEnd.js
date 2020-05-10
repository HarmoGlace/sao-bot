const { Listener } = require('discord-akairo');

class ProtectionEnd extends Listener {

    constructor() {
        super('protectionEnd', {
            emitter: 'client',
            event: 'protectionEnd'
        });
    }

    exec(msg, reason) {
        const client = this.client;
        const language = client.ensureMemberLanguage(msg.member);
        const command = language.commands.destruction;

        client.othersDB.set('destruction', false, 'started');

        const {villagers: {total, current}} = client.othersDB.get('destruction');

        const ratioTotal = 100 - (current === 0 ? 0 : current / total * 100);

        const teams = client.othersDB.get('destruction', 'teams');

        teams.sort((a, b) => b.kills - a.kills);

        let pointsTotal = Math.round((ratioTotal / 7) * (total / 10));
        if (ratioTotal === 100) pointsTotal *= 1,5

        const logs = [];

        for (const {id, kills} of teams) {
            const teamRatio = kills / total;

            const points = Math.round(teamRatio * pointsTotal);
            const team = client.teams.all.get(id);

            team.points.add(points);
            logs.push({team: team, points: points, percentage: (teamRatio * 100).toFixed(1)});
        }

        if (logs.length === 0) {
            msg.channel.send(command.end.no_point());
        } else {
            msg.channel.send(command.end.points(`\n\n\`\`${logs.map(team => `${team.team.name} : ${team.points} points (${team.percentage} %)`).join('``\n```')}\`\``));
        }



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

module.exports = ProtectionEnd;