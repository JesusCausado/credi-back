'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');

var Client = require('../models/client')

var controller = {

  test: (req, res) => {
    return res.status(200).send({
      message: "Controller client status ok!"
    });
  },

  save: (req, res) => {
    var params = req.body;
    /*try {
      var validate_name = !validator.isEmpty(params.name);
      var validate_systemName = !validator.isEmpty(params.systemName);
      var validate_route = !validator.isEmpty(params.route);
      var validate_menu = !validator.isEmpty(params.menu);
    } catch (err) {
      return res.status(404).send({
        status: 'error',
        message: 'faltan datos por enviar'
      });
    }*/

    //if (validate_name && validate_menu && validate_systemName && validate_route) {

      var client = new Client();
      client.lastName = params.lastName;
      client.name = params.name;
      client.tipoDoc = params.tipoDoc;
      client.nroDoc = params.nroDoc;
      client.lugarExp = params.lugarExp;
      client.fechaExp = params.fechaExp;
      client.sexo = params.sexo;
      client.lugarNac = params.lugarNac;
      client.fechaNac = params.fechaNac;
      client.estadoCivil = params.estadoCivil;
      client.state = true;

      client.save((err, clientStored) => {
        if (err || !clientStored) {
          return res.status(404).send({
            status: 'error',
            message: 'El cliente no se ha guardado'
          });
        }

        return res.status(200).send({
          status: 'success',
          client: clientStored
        });
      })

    /*} else {
      return res.status(500).send({
        status: 'error',
        message: 'Datos invalidos!'
      });
    }*/
  },

  getClients: (req, res) => {
    Client.find({}, (err, client) => {
      if (err || !client) {
        return res.status(404).send({
          status: 'error',
          message: 'No hay menus para mostrar!'
        });
      }

      return res.status(200).send({
        status: 'success',
        client
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
    var params = req.body;    
    var documento = params.nroDoc;  

    Client.findOneAndDelete({ nroDoc: documento }, (err, clientRemoved) => {
      console.log(err);
      console.log(clientRemoved);
      if (err || !clientRemoved) {
        return res.status(500).send({
          status: 'error',
          message: 'Error al borrar el articulo!'
        });
      }

      return res.status(200).send({
        status: 'success',
        client: clientRemoved
      });
    })
  }
};//End controller

module.exports = controller;