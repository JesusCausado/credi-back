'use strict'

var validator = require('validator');
var jwt = require('jsonwebtoken');
var User = require('../models/user');
const bcrypt = require('bcrypt');

var controller = {

  test: (req, res) => {
    return res.status(200).send({
      message: "Controller noAut status ok!"
    });
  },

  login: (req, res) => {
    var username = req.body.user
    var password = req.body.password

    User.findOne({ user: username }, (err, user) => {
      if (err || !user) {
        return res.status(404).send({
          status: 'error',
          message: 'Usuario no registrado!'
        });
      } else {
        
        if (!(username === user.user && bcrypt.compareSync(password, user.password))) {
          return res.status(404).send({
            error: 'usuario o contraseña inválidos'
          })
        }
        
        var tokenData = {
          username: username
        }

        var token = jwt.sign(tokenData, 'Secret Password', {
          expiresIn: 60 * 60 * 24 // expires in 24 hours
        })

        return res.status(200).send({
          token
        });
      }  
    });    
  }

};//End controller

module.exports = controller;