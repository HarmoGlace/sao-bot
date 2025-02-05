const { Listener } = require('discord-akairo');

class ProtectionAction extends Listener {

    constructor() {
        super('protectionAction', {
            emitter: 'client',
            event: 'protectionAction'
        });
    }

    exec(msg) {
        const client = this.client;
        const language = client.ensureMemberLanguage(msg.member);
        const command = language.commands.protection;

        client.ensureMember(msg.member)

        let {wave, timeout, started, villagers: {total, current}, end} = client.othersDB.get('protection');

        if (!started) return;

        const actions = [
            {
                name: 'protect',
                aliases: ['proteger', 'protéger', 'protégé', 'protege'],
                cooldown: 5000 // 5s
            },
            {
                name: 'teleportation',
                id: 'teleportation',
                aliases: [],
                cooldown: 3600000 // 1h
            },
            {
                name: 'invisibility',
                id: 'invisibility',
                aliases: [],
                cooldown: 600000 // 10m
            },
            {
                name: 'shield',
                id: 'shield',
                aliases: [],
                cooldown: 300000 // 5m
            }
        ]

        const actionTyped = msg.content.toLowerCase().replace('.', '');
        const match = actions.find(action => action.name.toLowerCase() === actionTyped || action.aliases.includes(actionTyped));

        if (!match) return;

        if (Date.now() > end) return client.emit('protectionEnd', msg, 'timeout');

        if (match.cooldown) {

            const reaming = client.isCooldown({member: msg.member, type: 'spell', cooldown: match.cooldown, id: match.id});

            if (reaming > 0) {
                return msg.channel.send(language.errors.user_cooldown(msg.author, client.getTime(reaming)));
            }

        }

        const member = client.usersDB.get(msg.author.id);

        const action = match.name;
        const boostRaw = member && member.cooldowns.spells.global_boost ? member.cooldowns.spells.global_boost : 0;
        const boost = boostRaw > Date.now();


        let kills = 0;

        if (action === 'protect') {
            kills = client.random(2, 8);
        } else if (action === 'teleportation') {
            kills = client.random(100, 150)
        } else if (action === 'shield') {
            kills = client.random(10, 50)
        }

        if (action === 'invisibility') {
            client.usersDB.set(msg.author.id, Date.now() + 120000, `cooldowns.spells.global_boost`);
            return msg.channel.send(command.action.invisibility(msg.author));
        }

        if (boost && action !== 'teleportation') kills *= (client.random(20, 40) / 10);

        kills = Math.round(kills);

        if (current - kills < 0) {
            kills -= kills - current;
            current = 0;
        }

        if (current !== 0) current -= kills;


        const team = client.getMemberTeam(msg.member);
        if (!team) return;
        const teams = client.othersDB.get('destruction', 'teams');
        const teamDB = teams.find(teamFind => teamFind.id === team.id);

        if (!teamDB) {
            client.othersDB.set('protection', [{id: team.id, kills: kills}], 'teams')
        } else {
            const index = teams.indexOf(teamDB);

            teams.splice(index, 1, {id: teamDB.id, kills: teamDB.kills + kills});

            client.othersDB.set('protection', teams, 'teams');
        }

        client.othersDB.set('protection', current, 'villagers.current');
        client.othersDB.ensure('protection', {players: {[msg.author.id]: 0}})
        client.othersDB.math('protection', '+', kills,  `players.${msg.author.id}`);

        if (action === 'protect') {
            msg.channel.send(command.action.protect(msg.author, kills, current))
        } else  {
            msg.channel.send(command.action.spell(msg.author, match.name, kills, current))
        }

        if (current <= 0) {
            client.emit('protectionEnd', msg, 'win');
        }




    }
}

module.exports = ProtectionAction;