const { AkairoClient, InhibitorHandler, ListenerHandler } = require('discord-akairo');
const { Collection } = require('discord.js');
const Enmap = require('enmap');
const Team = require('./Team');
const teams = require('./teams');
const Handler = require('./Handler');
const config = require('../config');
const languages = require('../languages/index');
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
                return this.teams.all.filter(teams => teams.type === 'sub');
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

        for (const {id, name, names = {}, aliases = [], role, subTeams} of teams) {
            const parent = this.teams.all.set(id, new Team(this, {
                id: id,
                name: name,
                names: names,
                aliases: aliases,
                roleId: role,
                type: 'parent',
                subsId: subTeams.map(subTeam => subTeam.id)
            }));

            for (const subTeam of subTeams) {
                this.teams.all.set(subTeam.id,  new Team(this,  {
                    id: subTeam.id,
                    name: subTeam.name,
                    names: subTeam.names || {},
                    aliases: subTeam.aliases || [],
                    roleId: subTeam.role,
                    type: 'sub',
                    parentId: id
                }));
            }
        }

        this.Team = Team;

        this.config = config;

        this.languages = languages;

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

    ensureMember = (member) => {
        if (member.bot) return;

        const team = this.getMemberTeam(member);

        return this.usersDB.ensure(member.id, {
            teams: [],
            xp: 0,
            level: 1,
            cooldowns: {
                commands: {

                },
                spells: {

                }
            },
            current: team ? team.id : false,
            points: 0,
            kills: 0
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
        });
        this.othersDB.ensure('protection', {
            wave: null,
            villagers: {
                total: null,
                current: null
            },
            teams: [],
            timeout: null,
            end: null,
            started: false
        });
        this.othersDB.ensure('boost', 1);
        this.othersDB.ensure('firsts', []);

    }

    ensurePoints = () => {
        for (const parent of this.teams.parents()) {
            this.parentTeamsDB.ensure(parent.id, {points: 0});
        }

        for (const sub of this.teams.subs()) {
            this.subsTeamsDB.ensure(sub.id, {points: 0})
        }
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

        if (!currentCooldown || currentCooldown <= 0) {
            this.setCooldown({member, type, cooldown, id});
            return 0;
        }

        return currentCooldown;

    }

    getGlobalCooldown = ({id, cooldown}) => {

        const globalCooldown = this.othersDB.ensure(id, 0);

        const end = globalCooldown + cooldown;

        const reaming = end - Date.now();

        return reaming;

    }

    getLeaderboard = ({ db = this.usersDB, max = 10, data = "level", secondData = false, dataName = data, dataPosition = "after", role = false, member: guildMember = false, guild = this.server, raw = false} = {}) => {

        let all = Array.from(db.fetchEverything());
        let arr1 = [];
        let member;

        all.forEach((f) => {
            if (f[1][data]) {
                member = guild.members.cache.get(f[0]);
                if (role) {
                    if (member && member.roles.cache.has(role)) {
                        arr1.push(f)
                    }
                } else {
                    arr1.push(f)
                }

            }
        });
        arr1.sort((a, b) => {
            if (secondData) {
                let diff = b[1][data] - a[1][data];
                if (!diff) {
                    diff = b[1][secondData] - a[1][secondData]
                }
                return diff
            } else {
                return b[1][data] - a[1][data]
            }

        });


        all = arr1;

        let content = "";

        let userd;

        for (let i = 0; i < all.length && i < max; i++) {
            let user = guild.members.cache.get(all[i][0]);
            if (!user) {
                all.splice(i, 1);
                i += -1
            } else {
                userd = user.displayName || "fdp";
                let emote = this.getPositionEmote(i + 1);
                if (guildMember && guildMember.id === user.id) {
                    content += `**${emote} ${userd} : ${dataPosition === "before" ? `${dataName} ` : ''}${all[i][1][data].toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}${dataPosition == "after" ? ` ${dataName}` : ''}**\n`
                } else {
                    content += `${emote} ${userd} : ${dataPosition === "before" ? `${dataName} ` : ''}${all[i][1][data].toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}${dataPosition == "after" ? ` ${dataName}` : ''}\n`
                }

            }

        }

        const position = guildMember && role && guildMember.roles.cache.has(role) || guildMember && !role ? all.findIndex(i => i[0] == guildMember.id) : false;

        const contentPosition = position || position === 0 ? this.getPosition(position) : false;

        return {
            content: content || "Il n'y a personne ❔",
            position: {
                number: position,
                content: contentPosition,
                emote: position || position === 0 ? this.getPositionEmote(position + 1) : false
            },
            raw: raw ? all : false
        }
    };

    getPosition = (position, emotes = false) => {
        let pos;
        const emote = this.getPositionEmote(position + 1);
        if (position === -1) {
            pos = "Tu n'es pas dans le classement !"
        } else {
            if (position === 0) {
                pos = `${emotes ? `${emote}` : ''}1er`
            } else {
                pos = `${emotes ? `${emote}` : ''}${position + 1}ème`
            }
        }
        return pos

    };

    updateLeaderboardRoles = async () => {
        const currents = this.othersDB.get('firsts');

        const leaderboard = this.getLeaderboard({
            max: 3,
            secondData: 'xp',
            dataPosition: 'before',
            dataName: 'niveau',
            raw: true
        });

        const { raw } = leaderboard;

        for (let i = 0; i < raw.length && i < 3; i++) {
            if (currents[i] !== raw[i][0]) {
                const role = this.config.levelRoles[i];

                const memberBefore = await this.server.members.fetch(currents[i]);
                const memberAfter = await this.server.members.fetch(raw[i][0]);

                if (currents[i] && memberBefore && memberBefore.roles.cache.has(role)) memberBefore.roles.remove(role);
                if (memberAfter && !memberAfter.roles.cache.has(role)) memberAfter.roles.add(role);
            }
        }

        this.othersDB.set('firsts', raw.map(r => r[0]));


    }

    updateLevel = (member, channel = false) => {

    while (this.usersDB.get(member.id, 'xp') >= this.usersDB.get(member.id, 'level') * 25) {

    const toRemove = this.usersDB.get(member.id, 'level') * 25;

    this.usersDB.math(member.id, "-", toRemove, "xp");

    this.usersDB.math(member.id, "+", 1, "level");

    const niveau = this.usersDB.get(member.id, "level");
    const points = niveau * 35 * this.othersDB.get("boost");

        this.usersDB.math(member.id, "+", points, "points");

    const team = this.getMemberTeam(member);

    if (!team) return;

    team.points.add(points);

    channel.send(`${member}, tu es désormais niveau ${niveau}. Tu as rapporté ${points} points à ton équipe`);
}
}

    setGlobalCooldown = ({id, cooldown}) => {

        this.othersDB.set(id, Date.now());
        return true;
    }

    isGlobalCooldown = ({id, cooldown}) => {

        const currentCooldown = this.getGlobalCooldown({id, cooldown});

        if (!currentCooldown || currentCooldown <= 0) {
            this.setGlobalCooldown({cooldown, id});
            return 0;
        }

        return currentCooldown;

    }

    getMemberLanguage = (member) => {

        let userLanguage = null;

        for (const [name, language] of Object.entries(languages)) {
            const roleId = config.roles[language.information.id];
            if (member.roles.cache.has(roleId)) userLanguage = language.information.id;
        }

        return userLanguage ? languages[userLanguage] : null;

    }

    ensureMemberLanguage = (member) => {
        return languages['french']; // Temp. Currently others languages are not supported
        // const memberLanguage = this.getMemberLanguage(member);
        // return memberLanguage ? memberLanguage : languages['french']; // default language
    }

    replaceChannel (channels) {
        for (const [name, id] of Object.entries(config.channels)) {
            channels.forEach((channel, i) => {
                if (name === channel) channels[i] = id;
            })
        }
        return channels;
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

    spaceNumber (number) {
        return number.toString().replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    getTime (string, {
        long = true,
        compact = false,
        language = languages.french
    } = {}) {
        const replaces = language.time;

        string = prettyms(string, {verbose: long, compact: compact});

        for (const {replace, with: replacator} of replaces) {
            string = string.replace(replace, replacator);
        }

        return string;

    }


}

module.exports = Client;