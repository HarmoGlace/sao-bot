const { Listener } = require('discord-akairo');

class MissingPermissions extends Listener {

    constructor() {
        super('missingPermissions', {
            emitter: 'commandHandler',
            event: 'missingPermissions'
        });
    }

    exec(msg, command, type, missing) {
        const client = this.client;
        const language = client.ensureMemberLanguage(msg.member);

        return msg.channel.send(language.errors.missingPermission(msg.author));

    }
}

module.exports = MissingPermissions;