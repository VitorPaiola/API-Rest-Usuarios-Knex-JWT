const knex = require("../database/connection");
var User = require("./User")

class PasswordToken {
    async create(email) {
        var user = await User.findByEmail(email)
        if (user != undefined) {
            try {
                var token = Date.now()
                await knex.insert({
                    user_id: user.id,
                    used: 0,
                    token: token // UUID
                }).table("passwordtokens")
                return { status: true, token: token }
            } catch (err) {
                console.log(err);
                return { status: false, err: err }
            }
        } else {
            return { status: false, err: "O e-mail passado não existe no bando de dados" }
        }
    }

    // TODO: A função deste método é validar o token
    async validate(token) {
        try {
            var result = await knex.select().where({ token: token }).table("passwordtokens")

            if (result.length > 0) { // Existe um token no campo?

                var tk = result[0]

                if (tk.used) { // Esse token está sendo usado?
                    return {status: false}
                } else {
                    return {status: true, token: tk}
                }

            } else { // Se não está sendo usado...
                return {status: false}
            }

        } catch (err) {
            console.log(err)
            return {status: false}
        }
    }

    async setUsed(token) {
        await knex.update({used: 1}).where({token: token}).table("passwordtokens")
    }
}

module.exports = new PasswordToken()