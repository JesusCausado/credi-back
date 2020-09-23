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

  login: async (req, res) => {
    var username = req.body.user
    var password = req.body.password

    try {
      var user = await User.findOne({ user: username });
      if (!(username === user.user && bcrypt.compareSync(password, user.password))) {
        return res.status(404).send({
          error: 'usuario o contraseña inválidos'
        })
      }
      
      var tokenData = {
        username: username
      }

      var token = jwt.sign(tokenData, 'Secret Password', {
        //expiresIn: 60 * 60 * 24 // expires in 24 hours
        //expiresIn: "10h" // it will be expired after 10 hours
        expiresIn: "20d" // it will be expired after 20 days
       //expiresIn: 120 // it will be expired after 120ms
      })

      return res.status(200).send({
        token
      });
    } catch (err) {
      return res.status(404).send({
        status: 'error',
        message: 'Usuario no registrado! ' + err
      });
    }
  }

};//End controller

module.exports = controller;