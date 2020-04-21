const { AkairoClient, InhibitorHandler, ListenerHandler } = require('discord-akairo');
const { Collection } = require('discord.js');
const Enmap = require('enmap');
const Team = require('./Team');
const teams = require('./teams');
const Handler = require('./Handler');
const config = require('../config');
const prettyms = require('pretty-ms');

class Client extends AkairoClient {

    constructor() {
        super({
            ownerID: ['216274175512281107', '349614850734817281']
        }, {
            partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER']
        })

        this.parentTeamsDB = new Enmap({name: 'parentTeams', ensureProps: true});
        this.subsTeamsDB = new Enmap({name: 'subsTeams', ensureProps: true});
        this.usersDB = new Enmap({name: 'users', ensureProps: true});
        this.othersDB = new Enmap({name: 'others', ensureProps: true});

        this.ensureOthers();

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

        let memberTeams = [];

        for (const subTeam of subTeams.array()) {
            if (member.roles.cache.has(subTeam.role.id)) memberTeams.push(subTeam);
        }

        return memberTeams;

    }

    hasTeams = (member, teams) =>  {

        const memberTeams = this.getMemberTeams(member);
        if (teams.length === 0) return memberTeams.length >= 1;

        const mutualTeams = [];

        for (const team of teams) {
            if (memberTeams.includes(team)) mutualTeams.push(team);
        }

        return mutualTeams.length >= 1;

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

                content.push(`${emote} ${sub.name} - ${this.spaceNumber(sub.points.current())} points`);

                index++;
            }

            fields.push({name: `**${parent.name}** - ${this.spaceNumber(parent.points.get())} points :`, value: content.join('\n'), inline: false});

        }

        message.edit('', {embed : {
                title: 'Points des équipes',
                description: fields.map(field => `${field.name}\n${field.value}`).join('\n\n'),
                color: parents.first().color,
                footer: {
                    text: 'Dernière mise à jour '
                },
                timestamp: new Date()
            }});

    }

    ensureMember = (user) => {

        return this.usersDB.ensure(user.id, {
            teams: [],
            xp: 0,
            level: 0,
            cooldowns: {
                commands: {

                },
                spells: {

                }
            }
        });

    }

    ensureOthers = () => {

        this.othersDB.ensure('competition', false);
        this.othersDB.ensure('destruction', {
            wave: null,
            villagers: {
                total: null,
                current: null
            },
            teams: [],
            timeout: null,
            end: null,
            started: false
        })

    }

    getCooldown = ({member, type = 'command', id, cooldown}) => {
        type = `${type}s`
        this.ensureMember(member);

        const memberDB = this.usersDB.get(member.id);
        const memberCooldown = memberDB.cooldowns[type][id];

        if (!memberCooldown) {
            // client.usersDB.set(message.member.id, Date.now(), `cooldowns.${type}.${id}`);
            return 0;
        }

        const end = memberCooldown + cooldown;
        console.log(end);
        const reaming = end - Date.now();

        return reaming;
    }

    setCooldown = ({member, type = 'command', coooldown, id}) => {

        type = `${type}s`
        this.ensureMember(member);

        this.usersDB.set(member.id, Date.now(), `cooldowns.${type}.${id}`);
        return true;
    }

    isCooldown = ({member, type = 'command', cooldown, id}) => {

        this.ensureMember(member);

        const currentCooldown = this.getCooldown({member, type, cooldown, id});
        console.log(currentCooldown);

        if (!currentCooldown || currentCooldown <= 0) {
            this.setCooldown({member, type, cooldown, id});
            return 0;
        }

        return currentCooldown;

    }

    spaceNumber (number) {
        return number.toString().replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
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
            emote = specialEmotes.find(e => e.position == position).emote;
        } else {
            emotes.forEach(e => {
                emote = emote.replace(e.position.toString(), e.emote);
            });
        }

        return emote;
    }

    random (max, min) {
        return Math.floor(Math.random() * (max - min + 1 )) + min;
    }

    getTime (string, {
        long = true,
        compact = false
    } = {}) {
        const replaces = [
            {
                replace: 'second',
                with: 'seconde'
            },
            {
                replace: 'hour',
                with: 'heure'
            },
            {
                replace: 'day',
                with: 'jour'
            },
            {
                replace: 'year',
                with: 'an'
            }
        ]

        string = prettyms(string, {verbose: long, compact: compact});

        for (const {replace, with: replacator} of replaces) {
            string = string.replace(replace, replacator);
        }

        return string;

    }


}

module.exports = Client;