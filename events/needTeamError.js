const { Listener } = require('discord-akairo');

class NeededTeamError extends Listener {

    constructor() {
        super('neededTeamError', {
            emitter: 'commandHandler',
            event: 'neededTeamError'
        });
    }

    exec(msg, command, teams) {
        const client = this.client;
        const language = client.ensureMemberLanguage(msg.member);
        let message = '';

        if (teams.length === 0) {
            message = language.errors.need_one_team(msg.author);
        } else {
            message = language.errors.need_teams(msg.author, `\`\`${teams.join('``, ``')}\`\``);
        }

        msg.channel.send(message);

        // return msg.channel.send(`Désolé ${msg.author}, mais tu dois ${teams.length === 0 ? `être dans une équipe` : `faire partie de l'une des équipes suivantes : } `);



    }
}

module.exports = NeededTeamError;