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

        parents.sort((a, b) => a.role.members.size - b.role.members.size);

        let parent = parents.first();

        parent.subs.sort((a, b) => a.role.members.size - b.role.members.size);

        let sub = parent.subs.first();

        const current = client.ensureMember(member);

        if (current.current) sub = client.teams.subs.get(current.current);
        parent = sub.parent;

        if (!parent || !sub) return;

        await member.roles.add(sub.role);
        await member.roles.add(parent.role);




        client.usersDB.set(member.id, sub.id, 'currentTeam')

        member.send(`Bienvenue sur L'Aincrad !`, {embed : {
                title: 'Nous sommes heureux de vous compter parmis nous !',
                description: `Nous avons une compétition nommée War Of Underworld où deux équipes principalent se battent pour la victoire :\n\n**Le Dark Territory** ⚔️ **L'Empire Humain**\n\nVous faites partie ${sub.names.des} (${parent.names.le})\nPour plus d'informations, regardez <#${client.config.channels.explications}>\n\nN'oubliez pas non plus d'aller prendre vos rôles dans <#${client.config.channels.roles}>`,
                color: sub.color
            }})

    }
}

module.exports = GuildMemberAdd;