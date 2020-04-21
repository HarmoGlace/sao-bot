const { Listener } = require('discord-akairo');

class DestructionAction extends Listener {

    constructor() {
        super('destructionAction', {
            emitter: 'client',
            event: 'destructionAction'
        });
    }

    exec(msg) {
        const client = this.client;

        client.ensureMember(msg.member)

        let {wave, timeout, started, villagers: {total, current}, end} = client.othersDB.get('destruction');

        if (!started) return;

        const actions = [
            {
                name: 'attack',
                aliases: ['attaquer', 'attacke', 'attaque', 'attaq']
            },
            {
                name: 'enhance armement',
                id: 'enhanced_armement',
                aliases: [],
                cooldown: 3600000 // 1h
            },
            {
                name: 'deep freeze',
                id: 'deep_freeze',
                aliases: [],
                cooldown: 600000 // 10m
            },
            {
                name: 'generate aerial element',
                id: 'aerial_element',
                aliases: [],
                cooldown: 300000 // 5m
            }
        ]

        const actionTyped = msg.content.toLowerCase().replace('.', '');
        const match = actions.find(action => action.name.toLowerCase() === actionTyped || action.aliases.includes(actionTyped));

        if (!match) return;

        if (Date.now() > end) return client.emit('destructionEnd', msg, 'timeout');

        if (match.cooldown) {
            const cooldown = match.cooldown;

            client.ensureMember(msg.member);

            const member = client.usersDB.get(msg.member.id);
            const memberCooldown = member.cooldowns.spells[match.id];

            const end = memberCooldown + cooldown;
            const reaming = end - Date.now();

            if (!memberCooldown) {
                client.usersDB.set(msg.member.id, Date.now(), `cooldowns.spells.${match.id}`)
            } else {
                if (reaming > 0) {
                    return msg.channel.send(`${msg.author}, tu dois encore attendre ${client.getTime(reaming)} avant de pouvoir utiliser ceci !`)
                }
            }
        }

        const member = client.usersDB.get(msg.author.id);

        const action = match.name;
        const boostRaw = member && member.cooldowns.spells.global_boost ? member.cooldowns.spells.global_boost : 0;
        const boost = boostRaw > Date.now();


        let kills = 0;

        if (action === 'attack') {
            kills = client.random(2, 8);
    } else if (action === 'enhance armement') {
            kills = client.random(100, 150)
        } else if (action === 'generate aerial element') {
            kills = client.random(10, 50)
        }

        if (action === 'deep freeze') {
            client.usersDB.set(msg.author.id, Date.now() + 120000, `cooldowns.spells.global_boost`);
            return msg.channel.send(`${msg.author}, tu utilises le sort **Deep Freeze**. Pendant 2 minutes tu tueras plus d'humains`);
        }

        if (boost) kills *= (client.random(20, 40) / 10);

        kills = Math.round(kills);

        if (current - kills < 0) {
            kills -= kills - current;
            current = 0;

        }


        const team = client.getMemberTeam(msg.member);
        if (!team) return;
        const teams = client.othersDB.get('destruction', 'teams');
        const teamDB = teams.find(teamFind => teamFind.id === team.id);

        if (!teamDB) {
            client.othersDB.set('destruction', [{id: team.id, kills: kills}], 'teams')
        } else {
            const index = teams.indexOf(teamDB);
            client.othersDB.set('destruction', teams.splice(index, 1, {id: teamDB.id, kills: teamDB.kills + kills}), 'teams');
        }

        client.othersDB.set('destruction', current, 'villagers.current');

        if (action === 'attack') {
            msg.channel.send(`${msg.author}, tu as tué ${kills} villageois. Il en reste ${current} !`)
        } else  {
            msg.channel.send(`${msg.author}, tu as utilisé le sort **${match.name}** et tué ${kills} villageois. Il en reste ${current}`)
        }

        if (current <= 0) {
            client.emit('destructionEnd', msg, 'win');
        }




    }
}

module.exports = DestructionAction;