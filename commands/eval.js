const Command = require('../structure/Command');

class Eval extends Command {
    constructor() {
        super('eval', { // id
            aliases: ['eval'],
            args: [
                {
                    id: 'eval',
                    type: "string",
                    match: 'separate'
                }
            ]
        })
    }

    async exec(msg, args) {
        console.log('execute')
        const client = this.client

        function exec(callback){
            try{
                return callback()
            }catch(error){
                return error
            }
        }
        async function wait(callback){
            try{
                return await callback()
            }catch(error){
                return error
            }
        }
        function get(nameOrID,message){
            nameOrID = nameOrID.toLowerCase()
            let getter = false
            if(!getter || nameOrID.includes("@&")){
                nameOrID = nameOrID.replace("@&","")
                getter = message.guild.roles.cache.get(nameOrID) ||
                    message.guild.roles.find(e=>{
                        return e.name.toLowerCase().includes(nameOrID)
                    }) || false
            }
            if(!getter || nameOrID.includes("@")){
                nameOrID = nameOrID.replace("@","")
                getter = message.guild.members.cache.get(nameOrID) ||
                    message.guild.members.cache.find(m=>{
                        return m.displayName.toLowerCase().includes(nameOrID) ||
                            m.user.username.toLowerCase().includes(nameOrID) ||
                            m.user.discriminator.includes(nameOrID)
                    }) || false
            }
            if(!getter || nameOrID.includes("#")){
                nameOrID = nameOrID.replace("#","")
                getter = message.guild.channels.get(nameOrID) ||
                    message.guild.channels.find(e=>{
                        return e.name.toLowerCase().includes(nameOrID)
                    }) || false
            }
            return getter || 'type data is not defined'
        }

        let code = args.eval
        if (!code) return msg.channel.send(`${msg.author}, merci de préciser un code à évaluer !`)
        code = code.join(" ")
        const message = msg

        let editable = false
        if(code.includes("await")){
            code = `wait(async function(){\n\t${code.replace(/\n/g,"\n\t")}\n})`
            let embed = {
                title: "En cours...",
                description: "Code en cours d'exécution..."
            }
            editable = await message.channel.send({embed : embed})
        }else{
            code = `exec(function(){\n\t${code.replace(/\n/g,"\n\t")}\n})`
        }
        let retour = null
        try{
            retour = await eval(code)
        }catch(err){
            retour = err
        }
        let embed = {
            title: "Eval, return",
            description: `${
                        `${retour}`.length>0?`${retour}`:"void"
                    }`.slice(0,2048)
        }
        if (editable){
            await editable.edit({embed : embed})
        }else{
            editable = await message.channel.send({embed : embed})
        }

    }
}

module.exports = Eval