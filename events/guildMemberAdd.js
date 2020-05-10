const { Listener } = require('discord-akairo');

class GuildMemberAdd extends Listener {

    constructor() {
        super('guildMemberAdd', {
            emitter: 'client',
            event: 'guildMemberAdd'
        });
    }

    async exec(member) {
        const client = this.client;

        const parents = client.teams.parents()

        parents.sort((a, b) => b.role.members.size - a.role.members.size);

        const parent = parents[0];

        parents.subs.sort((a, b) => b.role.members.size - a.role.members.size);

        const sub = parents.subs[0];

        await member.roles.add(sub.role);
        await member.roles.add(parent.role);

        member.send(`Bienvenue sur L'Aincrad !`, {embed : {
                title: 'Nous sommes heureux de vous compter parmis nous !',
                description: `Nous avons une compétition nommée War Of Underworld où deux équipes principalent se battent pour la victoire :\n\n**Le Dark Territory** ⚔️**Les chevaliers de l'intégrité**\n\nVous faites partie ${sub.names.des} (${parent.names.le})\nPour plus d'informations, regardez <#${client.config.channels.explications}>`
            }})

    }
}

module.exports = GuildMemberAdd;