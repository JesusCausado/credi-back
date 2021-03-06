'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');

var Menu = require('../models/menu')

var controller = {

  test: (req, res) => {
    return res.status(200).send({
      message: "Controller menu status ok!"
    });
  },

  save: async (req, res) => {
    var params = req.body;
    console.log(params);
    try {
      var validate_name = !validator.isEmpty(params.name);
      var validate_typeUser = !validator.isEmpty(params.typeUser);
    } catch (err) {
      return res.status(404).send({
        status: 'error',
        message: 'faltan datos por enviar'
      });
    }

    if (validate_name && validate_typeUser) {

      var menu = new Menu();
      menu.name = params.name;
      menu.idTypeUser = params.typeUser;

      try {
        var menuStored = await menu.save();
        return res.status(200).send({
          status: 'success',
          menu: menuStored
        });
      } catch (err) {
        return res.status(404).send({
          status: 'error',
          message: 'El menu no se ha guardado ' + err
        });
      }  

    } else {
      return res.status(500).send({
        status: 'error',
        message: 'Datos invalidos!'
      });
    }
  },

  getMenus: async (req, res) => {
    try {
      var menus = await Menu.find({});
      return res.status(200).send({
        status: 'success',
        menus
      });
    } catch (err) {
      return res.status(404).send({
        status: 'error',
        message: 'No hay menus para mostrar! ' + err
      });
    }  
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