const { AkairoClient, InhibitorHandler, ListenerHandler } = require('discord-akairo');
const { Collection } = require('discord.js');
const Enmap = require('enmap');
const Team = require('./Team');
const teams = require('./teams');
const Handler = require('./Handler');
const config = require('../config');

class Client extends AkairoClient {

    constructor() {
        super({
            ownerID: ['216274175512281107', '349614850734817281']
        }, {
            partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER']
        })

        this.parentTeamsDB = new Enmap({name: 'parentTeams'});
        this.subsTeamsDB = new Enmap({name: 'subsTeams'});

        this.teams = {
            all: new Collection(),
            parents: () => {
                return this.teams.all.filter(team => team.type === 'parent');
            },
            subs: () => {
                return this.teams.all.filter(teams => teams.type == 'sub');
            },
            get: (id) => {
                return this.teams.all.get(id);
                },
            find: (findFunction) => {
                return this.teams.all.find(findFunction);
            },
            resolve: (resolvable) => {
                    resolvable = resolvable.toLowerCase();
                    return this.teams.all.find(team => team.name.toLowerCase() === resolvable || team.id.toLowerCase() === resolvable || team.aliases.includes(resolvable)) || this.teams.all.find(team => resolvable.startsWith(team.name.toLowerCase()) || resolvable.startsWith(team.id.toLowerCase()));
                },
        };

        for (const {id, name, aliases = [], role, subTeams} of teams) {
            const parent = this.teams.all.set(id, new Team(this, {
                id: id,
                name: name,
                aliases: aliases,
                roleId: role,
                type: 'parent',
                subsId: subTeams.map(subTeam => subTeam.id)
            }));

            for (const subTeam of subTeams) {
                this.teams.all.set(subTeam.id,  new Team(this,  {
                    id: subTeam.id,
                    name: subTeam.name,
                    aliases: subTeam.aliases || [],
                    roleId: subTeam.role,
                    type: 'sub',
                    parentId: id
                }));
            }
        }

        this.Team = Team;

        this.config = config;

        this.commandHandler = new Handler(this, {
            directory: './commands/',
            prefix: "!",
            allowMention: true
        });

        this.inhibitorHandler = new InhibitorHandler(this, {
            directory: './inhibitors/'
        });

        this.listenerHandler = new ListenerHandler(this, {
            directory: './events/'
        });

        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            inhibitorHandler: this.inhibitorHandler,
            listenerHandler: this.listenerHandler
        });

        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.loadAll();

        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
        this.inhibitorHandler.loadAll();

        this.commandHandler.loadAll();

    }

    get server() {
        return this.guilds.cache.get(config.serverId);
    }

    getMemberTeam = (member) => {

        const subTeams = this.teams.subs();
        let memberTeam;

        for (const subTeam of subTeams.array()) {
            if (member.roles.cache.has(subTeam.role.id)) memberTeam = subTeam;
        }

        return memberTeam || null;

    }

    getMemberTeams = (member) => {

        const subTeams = this.teams.subs();
        let memberTeams;

        for (const subTeam of subTeams) {
            if (member.roles.cache.has(subTeam.role.id)) memberTeams.push(subTeam);
        }

        return memberTeams;

    }

    updatePoints = async () => {

        const channel = this.server.channels.cache.get(config.channels.points);
        const message = await channel.messages.fetch(config.messages.points);

        const parents = this.teams.parents();

        parents.sort((a, b) => b.points.get() - a.points.get());

        let fields = [];
        let content;
        let index;

        for (const parent of parents.array()) {

            parent.subs.sort((a, b) => b.points.current() - a.points.current());

            index = 1;
            content = [];

            for (const sub of parent.subs.array()) {

                const emote = this.getPositionEmote(index);

                content.push(`${emote} ${sub.name} - ${this.spaceNumber(sub.points.current())} points`)

                index++;
            }

            fields.push({name: `${parent.name} - ${this.spaceNumber(parent.points.get())} points :`, value: content.join('\n')})

        }

        message.edit('', {embed : {
                title: 'Points des équipes',
                fields: fields,
                color: parents.first().color
            }})

    }

    spaceNumber (number) {
        return number.toString().replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    }

    getPositionEmote (position) {

        const specialEmotes = [
            {
                position: 1,
                emote: "🥇"
            },
            {
                position: 2,
                emote: "🥈"
            },
            {
                position: 3,
                emote: "🥉"
            }
        ];
        const emotes = [
            {
                position: 10,
                emote: "🔟"
            },
            {
                position: 0,
                emote: "0️⃣"
            },
            {
                position: 1,
                emote: "1️⃣"
            },
            {
                position: 2,
                emote: "2️⃣"
            },
            {
                position: 3,
                emote: "3️⃣"
            },
            {
                position: 4,
                emote: "4️⃣"
            },
            {
                position: 5,
                emote: "5️⃣"
            },
            {
                position: 6,
                emote: "6️⃣"
            },
            {
                position: 7,
                emote: "7️⃣"
            },
            {
                position: 8,
                emote: "8️⃣"
            },
            {
                position: 9,
                emote: "9️⃣"
            }
        ];

        let emote = position.toString();

        if (position <= 3 && position >= 1) {
            emote = specialEmotes.find(e => e.position == position).emote
        } else {
            emotes.forEach(e => {
                emote = emote.replace(e.position.toString(), e.emote)
            })
        }

        return emote;
    }


}

module.exports = Client;