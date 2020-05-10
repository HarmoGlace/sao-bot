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
        const language = client.ensureMemberLanguage(msg.member);
        const command = language.commands.destruction;

        const villagers = client.random(1000, 5000);
        const timeout = Math.floor(client.random(villagers / 7 + 200, villagers / 9 + 200)) * 1000;

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


        return msg.channel.send(command.start.content(msg.author, villagers, client.getTime(timeout)), {embed : {
                title: command.start.title,
                color: 0xc23329,
                description: command.start.description
            }});

    }

    isLaunch (msg) {
        const client = this.client;
        const { started } = client.othersDB.get('destruction');
        return started;
    }
}

module.exports = Destruction;