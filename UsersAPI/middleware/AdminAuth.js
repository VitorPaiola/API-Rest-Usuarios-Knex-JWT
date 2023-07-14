const jwt = require("jsonwebtoken")
var secret = "podeSerQualquerCoisaDentroDessaString"

module.exports = function (req, res, next) {
    // Puxando um cabeçalho da requisição, chamada authorization
    const authToken = req.headers['authorization'];

    if (authToken != undefined) { // Se esse cabeçalho exite...
        const bearer = authToken.split(' ') // Dividindo ela em dois
        var token = bearer[1] // Pegando o segundo item deste token

        try {
            var decoded = jwt.verify(token, secret) // Retorna uma informação decodificada

            if (decoded.role == 1) {
                next() // next() passa a requisição p/ rota
            } else {
                res.status(403)
                res.send('Você não tem permissão para acessar')
                return
            }
        } catch (err) {
            res.status(403)
            res.send('Você não está autenticado')
            return
        }

    } else {
        res.status(403)
        res.send('Você não está autenticado')
        return
    }

}