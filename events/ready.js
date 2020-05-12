const { Listener } = require('discord-akairo');

class Ready extends Listener {

    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    async exec() {
        const client = this.client;



        for (const { initialize } of client.teams.all.array()) {
            initialize();
        }

        console.log(`Started on ${client.user.tag} on ${client.guilds.cache.size} guilds`);

        await client.updatePoints();

        client.subsTeamsDB.changed((key, oldValue, newValue) => {
            if (oldValue) client.updatePoints();
        })

    }
}

module.exports = Ready;