const Command = require('../structure/Command');
const prettyms = require('pretty-ms');

class Destruction extends Command {
    constructor() {
        super('destruction', { // id
            aliases: ['destruction'],
            launch: true,
            parentTeamCooldown: 600000,
            channel: 'destruction'
        })
    }

    async exec(msg, args) {

        const client = this.client;

        const villagers = client.random(100, 2800);
        const timeout = Math.floor(client.random(villagers / 3 + 120, villagers / 4 + 120)) * 1000;

        client.othersDB.set('destruction', {
            started: true,
            wave: 0,
            villagers: {
                total: villagers,
                current: villagers
            },
            teams: [],
            timeout: timeout,
            end: Date.now() + timeout
        });

        setTimeout(() => {

            const stillStarted = client.othersDB.get('destruction', 'started');

            if (!stillStarted) return;

            client.emit('destructionEnd', msg, 'timeout')

        }, timeout)

        return msg.channel.send(`${msg.author}, attaque commencée. Tu as trouvé un village avec ${villagers} villageois ! Les chevaliers de l'intégrité arriveront dans ${client.getTime(timeout)} !`, {embed : {
                title: 'Explication du fonctionnement du jeu'
            }});

    }

    isLaunch (msg) {
        const client = this.client;
        const { started } = client.othersDB.get('destruction');
        return started;
    }
}

module.exports = Destruction;