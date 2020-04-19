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
                    parent: id
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

    pointsUpdate = () => {

        const channel = this.server.channels.cache.get(config.channels.points);


    }


}

module.exports = Client;