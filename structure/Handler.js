const { AkairoHandler } = require('discord-akairo');

class Handler extends AkairoHandler {

    constructor(...args) {
        super(args);
    }


    async runPostTypeInhibitors(message, command) {
        if (command.ownerOnly) {
            const isOwner = this.client.isOwner(message.author);
            if (!isOwner) {
                this.emit(CommandHandlerEvents.COMMAND_BLOCKED, message, command, BuiltInReasons.OWNER);
                return true;
            }
        }

        if (this.runLocationCheck(message, command)) {
            return true
        }

        if (this.runBlacklistedChannelCheck(message, command)) {
            return true
        }

        if (this.runChannelCheck(message, command)) {
            return true
        }

        this.client.ensureUser(message.author)

        if (await this.runPermissionChecks(message, command)) {
            return true;
        }

        if (this.runCheckNeedCDF(message, command)) {
            return true
        }

        if (this.runCheckLimited(message, command)) {
            return true
        }

        if (this.runCheckFac(message, command)) {
            return true
        }

        const reason = this.inhibitorHandler
            ? await this.inhibitorHandler.test('post', message, command)
            : null;

        if (reason != null) {
            this.emit(CommandHandlerEvents.COMMAND_BLOCKED, message, command, reason);
            return true;
        }



        if (this.runCooldowns(message, command)) {
            return true;
        }

        return false;
    }
}

module.exports = Handler;