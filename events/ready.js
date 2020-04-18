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

        console.log(`Started on ${client}`);

        console.log(client.test);

        console.log(client.test.points.get(), client.test.points.add(1));

    }
}

module.exports = Ready;