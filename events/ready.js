const { Listener } = require('discord-akairo');

class Ready extends Listener {

    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    exec() {
        const client = this.client;

        console.log(`Started on ${client.user.tag} on ${client.guilds.cache.size} guilds`);

        for (const { initialize } of client.teams.all.array()) {
            initialize();
        }


    }
}

module.exports = Ready;