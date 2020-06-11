var jwt = require('jsonwebtoken');

exports.ensureAuthenticated = function (req, res, next) {  
  var token = req.headers['authorization']
  console.log(token);
  if (!token) {
    res.status(401).send({
      error: "Es necesario el token de autenticación"
    })
    return
  }

  token = token.replace('Bearer ', '')

  jwt.verify(token, 'Secret Password', function (err, user) {
    if (err) {
      res.status(401).send({
        error: 'Token inválido'
      })
    } else {
      next();
    }
  })
}
