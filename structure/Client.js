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

        this.teamsDB = new Enmap({name: 'teams'});

        this.teams = {
            all: new Collection(),
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
        }

        for (const {id, name, aliases = [], role} of teams) {
            this.teams.all.set(id, new Team(this, {id: id, name: name, aliases: aliases, roleId: role}));
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


}

module.exports = Client;