const { Listener } = require('discord-akairo');

class CompetitionDisabled extends Listener {

    constructor() {
        super('competitionDisabled', {
            emitter: 'commandHandler',
            event: 'competitionDisabled'
        });
    }

    exec(msg, command) {
        const client = this.client;
        const language = client.ensureMemberLanguage(msg.member);

        return msg.channel.send(language.errors.competitionDisabled(msg.author));

    }
}

module.exports = CompetitionDisabled;