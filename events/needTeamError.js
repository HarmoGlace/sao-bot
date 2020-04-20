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

        return msg.channel.send(`Désolé ${msg.author}, mais tu dois ${teams[0] === '[ALL]' ? `être dans une équipe` : `faire partie de l'une des équipes suivantes : \`\`${teams.join('``, ``')}\`\``} `);



    };
}

module.exports = NeededTeamError;