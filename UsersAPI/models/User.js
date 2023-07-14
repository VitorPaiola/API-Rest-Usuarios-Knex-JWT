const knex = require("../database/connection");
const bcrypt = require("bcrypt");
const PasswordToken = require("./PasswordToken");

//? Um model c/ knex é uma coleção de métodos para uso definidos por vc. 
//? Reutilizando-as em todo seu programa.

class User {

    // TODO Método que busca no database os campos selecionados, por padrão no formato de Array - []
    async findAll() {
        try {
            var result = await knex.select(["id", "name", "email", "role"]).table("users")
            return result
        } catch (err) {
            console.log(err);
            return []
        }
    }

    // TODO: Método que busca o id no database com base no id já cadastrado
    async findById(id) {
        try {
            var result = await knex.select(["id", "name", "email", "role"]).where({ id: id }).table("users")

            if (result.length > 0) {
                return result[0]
            } else {
                return undefined
            }

        } catch (err) {
            console.log(err);
            return undefined
        }
    }

        // TODO: Método que busca o email no database com base no email já cadastrado
        async findByEmail(email) {
            try {
                var result = await knex.select(["id", "name", "password", "email", "role"]).where({ email: email }).table("users")
    
                if (result.length > 0) {
                    return result[0]
                } else {
                    return undefined
                }
    
            } catch (err) {
                console.log(err);
                return undefined
            }
        }

    // TODO: Método de inserção na tabela do banco de dados
    async new(name, email, password) {

        try {
            var hash = await bcrypt.hash(password, 10);
            await knex.insert({ name, email, password: hash, role: 0 }).table("users");
        } catch (err) {
            console.log(err);
        }

    }

    // TODO: Método que evita duplicidade de cadastro por email
    async findEmail(email) {
        try {
            var result = await knex.select("*").from("users").where({ email: email })

            if (result.length > 0) {
                return true //! true porque eu encontrei um usuário cadastrado com esse email.
            } else {
                return false //! false porque eu não encontrei um usuário cadastrado com esse email
            }

        } catch (err) {
            console.log(err)
            return false
        }
    }

    // TODO: Método de atualização na tabela do banco de dados
    async update(id, email, name, role) {

        // Existe um usuário cadastrado no banco com base no id
        var user = await this.findById(id)

        // Usuário diferente de undefined 
        if (user != undefined) {
            // Objeto atualizado
            var editUser = {}

            // email diferente de undefined
            if (email != undefined) {
                // email diferente do email do usuário já cadastrado
                if (email != user.email) {
                    // Recebendo o novo email já atualizado
                    var result = await this.findEmail(email)
                    // Verificando se o email atualizado não existe no banco
                    if (result == false) {
                        editUser.email = email
                    } else {
                        return { status: false, err: "O e-mail já está cadastrado" }
                    }
                }
            }

            // nome diferente de undefined
            if (name != undefined) {
                // Crio um campo para esse nome ser atualizado
                editUser.name = name
            }

            // role diferente de undefined
            if (role != undefined) {
                // Crio um campo para essa role ser atualizado
                editUser.role = role
            }

            try {
                // Atualiza o banco de dados para gente
                await knex.update(editUser).where({ id: id }).table("users")
                return { status: true }
            } catch (err) {
                return { status: false, err: err }
            }

        } else {
            return { status: false, err: "O usuário não existe" }
        }

    }

    // TODO: Método de exclusão na tabela do banco de dados
    async delete(id) {
        var user = await this.findById(id)
        if (user != undefined) {

            try {
                await knex.delete().where({ id: id }).table("users")
                return { status: true }
            } catch (err) {
                return { status: false, err: err }
            }

        } else {
            return { status: false, err: "O usuário não existe, portanto não pode ser deletado" }
        }
    }

    // TODO: Método resposável por alterar a senha com base nos parâmetros informados
    async changePassword(newPassword, id, token) {
        var hash = await bcrypt.hash(newPassword, 10); // hash da variável newPassword
        // Atualiza no campo password onde id passado é idêntico ao que eu passei como parâmetro, na tabela users
        await knex.update({password: hash}).where({id: id}).table("users")
        await PasswordToken.setUsed(token) // Atualiza o token do usuário
    }

}

module.exports = new User();