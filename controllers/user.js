'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');
const bcrypt = require('bcrypt');

var User = require('../models/user')

const encript = (pass, saltDefault) => {
  if (saltDefault) {
    var salt = saltDefault;
  } else {
    var salt = bcrypt.genSaltSync(15);
  }
  const hash = bcrypt.hashSync(pass, salt);
  return {
    salt,
    hash
  };
}

var controller = {

  test: (req, res) => {
    return res.status(200).send({
      message: "Controller user status ok!"
    });
  },

  save: (req, res) => {
    var params = req.body;

    try {
      var validate_name = !validator.isEmpty(params.name);
      var validate_lastName = !validator.isEmpty(params.lastName);
      var validate_user = !validator.isEmpty(params.user);
      var validate_email = !validator.isEmpty(params.email);
      var validate_password = !validator.isEmpty(params.password);
      var validate_typeUser = !validator.isEmpty(params.typeUser);

    } catch (err) {
      return res.status(404).send({
        status: 'error',
        message: 'faltan datos por enviar'
      });
    }

    if (validate_name && validate_lastName && validate_user
      && validate_email && validate_password && validate_typeUser) {

      var pass = encript(params.password, null);      
      var user = new User();
      user.name = params.name;
      user.lastName = params.lastName;
      user.user = params.user;
      user.email = params.email;
      user.password = pass.hash;
      user.salt = pass.salt;
      user._idTypeUser = params.typeUser;

      user.save((err, userStored) => {
        if (err || !userStored) {
          return res.status(404).send({
            status: 'error',
            message: 'El usuario no se ha guardado'
          });
        }

        return res.status(200).send({
          status: 'success',
          user: userStored
        });
      })

    } else {
      return res.status(500).send({
        status: 'error',
        message: 'Datos invalidos!'
      });
    }
  },

  getUsers: (req, res) => {
    User.find((err, users) => {
      if (err || !users) {
        return res.status(404).send({
          status: 'error',
          message: 'No hay usuarios para mostrar!'
        });
      }

      return res.status(200).send({
        status: 'success',
        users
      });
    })
  },

  getUser: (req, res) => {
    var username = req.body.username
    if (!username || username == null) {
      return res.status(404).send({
        status: 'error',
        messagge: 'Debe enviar el usuario a buscar!'
      });
    }
    User.findOne({ "user": username }, (err, user) => {
      if (err || !user) {
        return res.status(404).send({
          status: 'error',
          message: 'No se encontro el usuario!'
        });
      }
      return res.status(200).send({
        status: 'success',
        user
      });
    })
  },

  update: (req, res) => {
    var params = req.body;
    const data = {
      name: params.name,
      lastName: params.lastName,
      user: params.user,
      email: params.email,
      password: '',
      typeUser: params.typeUser
    }

    try {
      var validate_id = !validator.isEmpty(params.id);
      var validate_name = !validator.isEmpty(params.name);
      var validate_lastName = !validator.isEmpty(params.lastName);
      var validate_user = !validator.isEmpty(params.user);
      var validate_email = !validator.isEmpty(params.email);
      var validate_password = !validator.isEmpty(params.password);
      var validate_typeUser = !validator.isEmpty(params.typeUser);

    } catch (err) {
      return res.status(404).send({
        status: 'error',
        message: 'faltan datos por enviar'
      });
    }

    if (validate_id && validate_name && validate_lastName && validate_user
      && validate_email && validate_password && validate_typeUser) {      

      User.findOne({ "_id": params.id }, (err, user) => {
        if (err || !user) {
          return res.status(404).send({
            status: 'error',
            message: 'No se encontro el usuario!'
          });
        }
        var pass = encript(params.password, user.salt);
        data.password = pass.hash;

        User.findByIdAndUpdate({ _id: params.id }, data, { new: true },
          (err, userUpdate) => {
          if (err || !userUpdate) {
            return res.status(500).send({
              status: 'error',
              message: 'Error al actualizar el usuario!'
            });
          }

          return res.status(200).send({
            status: 'success',
            user: userUpdate
          });
        });
      });
    } else {
      return res.status(404).send({
        status: 'error',
        message: 'Datos invalidos!'
      });
    }
  },

  delete: (req, res) => {
    //Obtener el id del articulo por la url
    var articleId = req.params.id;

    //Find and Delete
    Article.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {
      if (err || !articleRemoved) {
        return res.status(500).send({
          status: 'error',
          message: 'Error al borrar el articulo!'
        });
      }

      return res.status(200).send({
        status: 'success',
        article: articleRemoved
      });
    })
  }
};//End controller

module.exports = controller;