const Enmap = require('enmap');

class Team {

    constructor(client, {
        name: name,
        roleId: roleId,
        id: id,
        aliases: aliases
    } = {}) {
        this.client = client;

        client.teams.all.set(id, this);

        this.dataBase = client.teamsDB;

        this.name = name;
        this.roleId = roleId;
        this.id = id;
        this.aliases = aliases;

        this.dataBase.ensure(id, {
            points: 0
        })

        this.points = {
            get: () => {
                return this.dataBase.get(id, 'points')
            },
            add: (points) => {
                return this.points.set(this.points.get() + points);
            },
            remove: () => {
                return this.points.set(this.points.get() - points);
            },
            set: (points) => {
                return this.dataBase.set(id, points, 'points');
            }
        }

    }

    initialize = () => {
        this.role = this.client.server.roles.cache.get(this.roleId);

        return true;
    }

}

module.exports = Team;