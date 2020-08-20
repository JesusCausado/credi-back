'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');

var TypeUser = require('../models/typeUser')

var controller = {

  test: (req, res) => {
    return res.status(200).send({
      message: "Controller typeUser status ok!"
    });
  },

  save: (req, res) => {
    var params = req.body;
    try {
      var validate_name = !validator.isEmpty(params.name);
      var validate_description = !validator.isEmpty(params.description);
      var validate_admin = !validator.isEmpty(params.admin);

    } catch (err) {
      return res.status(404).send({
        status: 'error',
        message: 'faltan datos por enviar'
      });
    }

    if (validate_name && validate_description && validate_admin) {

      var typeUser = new TypeUser();
      typeUser.name = params.name;
      typeUser.description = params.description;
      typeUser.admin = params.admin;

      typeUser.save((err, typeUserStored) => {
        if (err || !typeUserStored) {
          return res.status(404).send({
            status: 'error',
            message: 'El tipo de usuario no se ha guardado'
          });
        }

        return res.status(200).send({
          status: 'success',
          typeUser: typeUserStored
        });
      })

    } else {
      return res.status(500).send({
        status: 'error',
        message: 'Datos invalidos!'
      });
    }
  },

  getArticles: (req, res) => {
    var query = Article.find({});
    //Ultimos articulos
    var last = req.params.last;
    if (last || last != undefined) query.limit(1);

    query.sort('_id').exec((err, articles) => {
      if (err || !articles) {
        return res.status(404).send({
          status: 'error',
          message: 'No hay articulos para mostrar!'
        });
      }

      return res.status(200).send({
        status: 'success',
        articles
      });
    })
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
    User.findOne({"user": username}, (err, user) => {
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