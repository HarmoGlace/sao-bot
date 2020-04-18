const { AkairoClient, InhibitorHandler, ListenerHandler } = require('discord-akairo');
const Enmap = require('enmap');
const Team = require('./Team');
const Handler = require('./Handler');
const config = require('../config');

class Client extends AkairoClient {

    constructor() {
        super({
            ownerID: ['216274175512281107', '349614850734817281']
        }, {
            partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER']
        })

        this.teams = new Enmap({name: 'teams'})

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

}

module.exports = Client;