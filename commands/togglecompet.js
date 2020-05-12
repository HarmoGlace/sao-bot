const Command = require('../structure/Command');

class ToggleCompetition extends Command {
    constructor() {
        super('toggleCompetition', { // id
            aliases: ['toggleCompetition'],
            ownerOnly: true
        })
    }

    async exec(msg, args) {

        const client = this.client;

        const current = client.othersDB.get('competition');

        client.othersDB.set('competition', !current);

        msg.channel.send(`${msg.author}, compétition ${!current ? 'activée' : 'désactivée'}`)


    }
}

module.exports = ToggleCompetition;