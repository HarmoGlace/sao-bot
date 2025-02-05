const Command = require('../structure/Command');
const prettyms = require('pretty-ms');

class Protection extends Command {
    constructor() {
        super('protection', { // id
            aliases: ['protection'],
            launch: true,
            parentTeamCooldown: 600000,
            channel: 'protection',
            needCompetition: true
        })
    }

    async exec(msg, args) {

        const client = this.client;
        const language = client.ensureMemberLanguage(msg.member);
        const command = language.commands.protection;

        const villagers = client.random(1000, 5000);
        const timeout = Math.floor(client.random(villagers / 4 + 200, villagers / 6 + 200)) * 1000;

        client.othersDB.set('protection', {
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

            const stillStarted = client.othersDB.get('protection', 'started');

            if (!stillStarted) return;

            client.emit('protectionEnd', msg, 'timeout')

        }, timeout)


        return msg.channel.send(command.start.content(msg.author, villagers, client.getTime(timeout)), {embed : {
                title: command.start.title,
                color: 0x294ac2,
                description: command.start.explenation
            }});

    }

    isLaunch (msg) {
        const client = this.client;
        const { started } = client.othersDB.get('protection');
        return started;
    }
}

module.exports = Protection;