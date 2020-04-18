const Enmap = require('enmap');

class Team {

    constructor(client, {
        name: name,
        role: role,
        id: id
    } = {}) {
        this.client = client;

        this.dataBase = client.teams;

        this.name = name;
        this.role = role;
        this.id = id;

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

}

module.exports = Team;