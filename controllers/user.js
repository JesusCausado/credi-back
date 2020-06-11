'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');

var User = require('../models/user')

var controller = {

  test: (req, res) => {
    return res.status(200).send({
      message: "Controller user status ok!"
    });
  },

  save: (req, res) => {
    //Recoger parametros por post
    var params = req.body;

    //Validar datos (validator)
    try {
      var validate_name = !validator.isEmpty(params.name);
      var validate_lastName = !validator.isEmpty(params.lastName);
      var validate_user = !validator.isEmpty(params.user);
      var validate_email = !validator.isEmpty(params.email);
      var validate_password = !validator.isEmpty(params.password);

    } catch (err) {
      return res.status(404).send({
        status: 'error',
        message: 'faltan datos por enviar'
      });
    }

    if (validate_name && validate_lastName && validate_user
      && validate_email && validate_password) {

      var user = new User();
      user.name = params.name;
      user.lastName = params.lastName;
      user.user = params.user;
      user.email = params.email;
      user.password = params.password;

      user.save((err, userStored) => {
        console.log(userStored);
        if (err || !userStored) {
          return res.status(404).send({
            status: 'error',
            message: 'El articulo no se ha guardado'
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

  getArticle: (req, res) => {
    //Recoger el id de la url
    var articleId = req.params.id;

    //Comprobar que existe
    if (!articleId || articleId == null) {
      return res.status(404).send({
        status: 'error',
        messagge: 'Debe enviar el articulo a buscar!'
      });
    }

    //Buscar el articulo
    Article.findById(articleId, (err, article) => {
      if (err || !article) {
        return res.status(404).send({
          status: 'error',
          message: 'No se encontro el articulo!'
        });
      }

      //Devolver en json
      return res.status(200).send({
        status: 'success',
        article
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