const User = require("../models/User");
const PasswordToken = require("../models/PasswordToken");
const jwt = require("jsonwebtoken")

// p/ não compartilhar com ninguem, é como se fosse chave da criptografia do token
var secret = "podeSerQualquerCoisaDentroDessaString"
const bcrypt = require("bcrypt");

class UserController {

    // TODO: Método que chama a model User e executa o método findAll(), retornando um JSON da busca encontrada
    async index(req, res) {
        var users = await User.findAll()
        res.json(users)
    }

    async findUser(req, res) {
        var id = req.params.id
        var user = await User.findById(id)
        if (user == undefined) {
            res.status(404)
            res.json({ err: "Usuário não encontrado" })
        } else {
            res.status(200)
            res.json(user)
        }
    }

    //? Todo endpoint(função) que vc criar, vc precisa passar uma resposta

    // TODO: Método que verifica se o email é undefined/existente e retorna o tipo de status da response
    async create(req, res) {
        var { name, email, password } = req.body //! Requisição via POST usar o 'req.body'

        if (email == undefined || email == '' || email == ' ') {
            res.status(400)
            res.json({ err: "O e-mail é inválido" })
            return
        }

        var emailExists = await User.findEmail(email)

        if (emailExists) {
            res.status(406)
            res.json({ err: "O e-mail já está cadastrado" })
            return
        }

        await User.new(name, email, password)

        res.status(200)
        res.send("Requisição efetuada com sucesso")
    }

    // TODO:  Atualiza o usuário com base nos parâmetros passados
    async edit(req, res) {
        var { id, email, name, role } = req.body //! Requisição via PUT usar o 'req.body'
        var result = await User.update(id, email, name, role)
        if (result != undefined) {
            if (result.status) {
                res.status(200)
                res.send("Atualização efetuada com sucesso")
            } else {
                res.status(406)
                res.send(result.err)
            }
        } else {
            res.status(406)
            res.send("Ocorreu um erro no servidor")
        }
    }

    // TODO: Deleta o usuário com base nos parâmetros passados
    async remove(req, res) {
        var id = req.params.id

        var result = await User.delete(id)

        if (result.status) {
            res.status(200)
            res.send("Deletação efetuada com sucesso")
        } else {
            res.status(406)
            res.send(result.err)
        }

    }

    //TODO: Método responsável por recuperar a senha do usuário, caso já possua um email cadastrado
    async recoverPassword(req, res) {
        var email = req.body.email //! Requisição via POST usar o 'req.body'
        var result = await PasswordToken.create(email)
        if (result.status) {
            res.status(200)
            res.send("" + result.token)
            //NodeMailer.send(email, result.token)
        } else {
            res.status(406)
            res.send(result.err)
        }
    }

    //TODO: Método responsável por alterar a senha do usuário
    async changePassword(req, res) {
        // Novo token passada via o corpo da requisição
        var token = req.body.token //! Requisição via POST usar o 'req.body'
        // Nova senha passada via o corpo da requisição
        var password = req.body.password //! Requisição via POST usar o 'req.body'
        var isTokenValid = await PasswordToken.validate(token)  // A variável isTokenValid recebe um token válido  
        if (isTokenValid.status) { // Se o status do token for true...
            // Atualiza a nova senha | o id do usuário | e o token do usuário
            await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token)
            res.status(200)
            res.send("Senha alterada com sucesso")
        } else { // Se o token já foi utilizado ele entra nesse else e retorna Token inválido
            res.status(406)
            res.send("Token inválido")
        }

    }

    async login(req, res) {
        var { email, password } = req.body

        var user = await User.findByEmail(email)

        if(user != undefined) {
            var result = await bcrypt.compare(password, user.password)
            if(result) {
                var token = jwt.sign({ email: user.email, role: user.role }, secret);
                res.status(200)
                res.json({token: token})
            } else {
                res.status(406)
                res.json({err: "Senha incorreta"})
            }
        } else {
            res.status(406)
            res.json({status: false, err: "O usuário não existe"})
        }

    }

}

module.exports = new UserController();