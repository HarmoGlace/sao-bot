const { Command: AkairoCommand } = require('discord-akairo');

class Command extends AkairoCommand {

    constructor(id, options = {}) {

        super(id, options);

        const {
            aliases = [],
            args = this.args || [],
            quoted = true,
            separator,
            channel = null,
            ownerOnly = false,
            editable = true,
            typing = false,
            cooldown = null,
            ratelimit = 1,
            location = 'guild',
            launch = false,
            needCompetition = false,
            neededLevel = false,
            subTeamCooldown,
            parentTeamCooldown,
            teamsNeeded,
            argumentDefaults = {},
            description = '',
            prefix = this.prefix,
            clientPermissions = this.clientPermissions,
            userPermissions = this.userPermissions,
            regex = this.regex,
            condition = this.condition || (() => false),
            before = this.before || (() => undefined),
            lock,
            ignoreCooldown,
            ignorePermissions,
            flags = [],
            optionFlags = []
        } = options;

        this.location = location;
        this.needCompetition = needCompetition;
        this.teamsNeeded = teamsNeeded;
        this.subTeamCooldown = subTeamCooldown;
        this.parentTeamCooldown = parentTeamCooldown;
        this.launch = launch;
        this.neededLevel = neededLevel;

    }


}

module.exports = Command;