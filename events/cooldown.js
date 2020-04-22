const { Listener } = require('discord-akairo');

class Cooldown extends Listener {

    constructor() {
        super('cooldown', {
            emitter: 'commandHandler',
            event: 'cooldown'
        });
    }

    exec(msg, command, reaming, type, team) {
        const client = this.client;
        reaming = client.getTime(reaming);
        const language = client.ensureMemberLanguage(msg.member);

        if (type === 'user') {
            return msg.channel.send(language.errors.user_cooldown(msg.author, reaming));
        } else if (type === 'subTeam' || type === 'parentTeam') {
            return msg.channel.send(language.errors.team_cooldown(msg.author, team.name, reaming));
        }

    }
}

module.exports = Cooldown;