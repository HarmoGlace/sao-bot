const Command = require('../structure/Command');
const prettyms = require('pretty-ms');

class Destruction extends Command {
    constructor() {
        super('destruction', { // id
            aliases: ['destruction'],
        })
    }

    async exec(msg, args) {

        const client = this.client;

        const { started } = client.othersDB.get('destruction');

        if (started) return msg.channel.send(`${msg.author}, une partie est déjà en cours !`);

        const villagers = client.random(25, 400);
        const timeout = Math.floor(client.random(120, villagers / 2 + 120)) * 1000;

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
}

module.exports = Destruction;