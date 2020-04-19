const Enmap = require('enmap');

class Team {

    constructor(client, {
        name,
        roleId,
        id,
        aliases,
        type = 'parent',
        parentId = null,
        subsId = null,
        color
    } = {}) {
        this.client = client;

        client.teams.all.set(id, this);

        this.parentDB = client.parentTeamsDB;
        this.subsDB = client.subsTeamsDB;

        this.dataBase = type === 'parent' ? this.parentDB : this.subsDB;

        this.name = name;
        this.roleId = roleId;
        this.id = id;
        this.aliases = aliases;
        this.type = type;

        this.parentId = parentId;
        this.subsId = subsId;

        this.dataBase.ensure(id, {
            points: 0
        })

        if (type === 'parent') {

            this.points = {
                get: () => {
                    return this.dataBase.get(id, 'points')
                },
                add: (points) => {
                    return this.points.set(this.points.get() + points);
                },
                remove: (points) => {
                    return this.points.set(this.points.get() - points);
                },
                set: (points) => {
                    return this.dataBase.set(id, points, 'points');
                }
            }

        } else if (type === 'sub') {

            this.points = {
                global: () => {
                    return this.parentDB.get(this.parent.id, 'points');
                },
                current: () => {
                    return this.dataBase.get(id, 'points');
                },
                add: (points) => {
                    this.parent.points.add(points);
                    return this.points.setLocal(this.points.current() + points);
                },
                remove: (points) => {
                    this.parent.points.remove(points);
                    return this.points.setLocal(this.points.current() - points);
                },
                set: (points) => {
                    const diff = points - this.points.current();
                    this.parent.points.add(diff);
                    return this.dataBase.set(id, points, 'points');
                },
                setLocal: (points) => {
                    return this.dataBase.set(id, points, 'points');
                }
            }

        }



    }

    initialize = () => {
        const client = this.client;

        this.role = client.server.roles.cache.get(this.roleId);

        if (!this.color) this.color = this.role.color;

        const type = this.type;

        if (type === 'parent') {

            this.subs = client.teams.subs().filter(team => team.parentId === this.id);

        } else if (type === 'sub') {

            this.parent = client.teams.parents().find(team => team.subsId.includes(this.id));

        }

        return true;
    }

}

module.exports = Team;