const { Listener } = require('discord-akairo');

class AlreadyLaunchedError extends Listener {

    constructor() {
        super('alreadyLaunchedError', {
            emitter: 'commandHandler',
            event: 'alreadyLaunchedError'
        });
    }

    exec(msg, command) {
        const client = this.client;

        const language = client.ensureMemberLanguage(msg.member);

        return msg.channel.send(language.errors.already_launched(msg.author));
    }
}

module.exports = AlreadyLaunchedError;