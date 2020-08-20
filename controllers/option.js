'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');

var Option = require('../models/option')
var OptionUser = require('../models/optionUser');

var controller = {

  test: (req, res) => {
    return res.status(200).send({
      message: "Controller option status ok!"
    });
  },

  save: (req, res) => {
    var params = req.body;
    try {
      var validate_name = !validator.isEmpty(params.name);
      var validate_systemName = !validator.isEmpty(params.systemName);
      var validate_route = !validator.isEmpty(params.route);
      var validate_menu = !validator.isEmpty(params.menu);
    } catch (err) {
      return res.status(404).send({
        status: 'error',
        message: 'faltan datos por enviar'
      });
    }

    if (validate_name && validate_menu && validate_systemName && validate_route) {

      var option = new Option();
      option.name = params.name;
      option.state = true,
      option.systemName = params.systemName;
      option.route = params.route;
      option._idMenu = params.menu;

      option.save((err, optionStored) => {
        if (err || !optionStored) {
          return res.status(404).send({
            status: 'error',
            message: 'La opcion no se ha guardado'
          });
        }

        return res.status(200).send({
          status: 'success',
          option: optionStored
        });
      })

    } else {
      return res.status(500).send({
        status: 'error',
        message: 'Datos invalidos!'
      });
    }
  },

  getOptions: (req, res) => {
    var menu = req.body.menu;
    var typeUser = req.body.typeUser;
    /*Option.find({ "_idMenu": menu }, (err, option) => {
      if (err || !option) {
        return res.status(404).send({
          status: 'error',
          message: 'No hay menus para mostrar!'
        });
      }

      return res.status(200).send({
        status: 'success',
        option
      });
    })*/
    OptionUser.find({ "_idTypeUser": typeUser  }, (err, optionUsers) => {
      if (err || !optionUsers) {
        return res.status(404).send({
          status: 'error',
          message: 'No hay menus para mostrar!'
        });
      }
      Option.populate(optionUsers, { path: "_idOption", match: {_idMenu: menu}}, (err, option) => {        
        if (err || !option) {
          return res.status(404).send({
            status: 'error',
            message: 'No hay menus para mostrar!'
          });
        }
  
        return res.status(200).send({
          status: 'success',
          option: option
        });
      });
    });
  },

  getUser: (req, res) => {
    var username = req.body.username

    //Comprobar que existe
    if (!username || username == null) {
      return res.status(404).send({
        status: 'error',
        messagge: 'Debe enviar el usuario a buscar!'
      });
    }

    //Buscar el articulo
    User.findOne({ "user": username }, (err, user) => {
      if (err || !user) {
        return res.status(404).send({
          status: 'error',
          message: 'No se encontro el usuario!'
        });
      }

      //Devolver en json
      return res.status(200).send({
        status: 'success',
        user
      });
    })
  },

  update: (req, res) => {
    //Obtener el id del articulo por la url
    var articleId = req.params.id;

    //Recoger los datos que llegan por put
    var params = req.body;

    //Validar datos
    try {
      var validate_tittle = !validator.isEmpty(params.tittle);
      var validate_content = !validator.isEmpty(params.content);
    } catch (err) {
      return res.status(500).send({
        status: 'error',
        message: 'faltan datos por enviar'
      });
    }

    if (validate_tittle && validate_content) {
      //Find and update
      Article.findByIdAndUpdate({ _id: articleId }, params, { new: true },
        (err, articleUpdate) => {
          if (err || !articleUpdate) {
            return res.status(500).send({
              status: 'error',
              message: 'Error al actualizar el articulo!'
            });
          }

          return res.status(200).send({
            status: 'success',
            article: articleUpdate
          });
        });
      //Devolver respuesta
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