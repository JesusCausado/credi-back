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

  save: async (req, res) => {
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
      option.idMenu = params.menu;

      try {
        var clientStored = await option.save();
        return res.status(200).send({
          status: 'success',
          option: optionStored
        });
      } catch (err) {
        return res.status(404).send({
          status: 'error',
          message: 'La opcion no se ha guardado ' + err
        });
      }

    } else {
      return res.status(500).send({
        status: 'error',
        message: 'Datos invalidos!'
      });
    }
  },

  getOptions: async (req, res) => {
    var menu = req.body.menu;
    var typeUser = req.body.typeUser;
    /*Option.find({ "idMenu": menu }, (err, option) => {
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

    try {
      var optionUsers = await OptionUser.find({ "idTypeUser": typeUser  });
      try {
        var option = await Option.populate(optionUsers, { path: "idOption", match: {idMenu: menu}});
        return res.status(200).send({
          status: 'success',
          option: option
        });
      } catch (err) {
        return res.status(404).send({
          status: 'error',
          message: 'No hay opciones para mostrar! ' + err
        });
      }
    } catch (err) {
      return res.status(404).send({
        status: 'error',
        message: 'No hay menus para mostrar! ' + err
      });
    }

    /*OptionUser.find({ "idTypeUser": typeUser  }, (err, optionUsers) => {
      if (err || !optionUsers) {
        return res.status(404).send({
          status: 'error',
          message: 'No hay menus para mostrar!'
        });
      }
      Option.populate(optionUsers, { path: "idOption", match: {idMenu: menu}}, (err, option) => {        
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
    });*/
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