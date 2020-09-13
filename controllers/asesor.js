'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');

var Asesor = require('../models/asesor')

var controller = {

  test: (req, res) => {
    return res.status(200).send({
      message: "Controller Asesor status ok!"
    });
  },

  save: async (req, res) => {
    var params = req.body;
    try {
      var val_idPrestamista = !validator.isEmpty(params.idPrestamista);
      var val_idAsesor = !validator.isEmpty(params.idAsesor);

    } catch (err) {
      return res.status(404).send({
        status: 'error',
        message: 'faltan datos por enviar'
      });
    }

    if (val_idPrestamista && val_idAsesor) {

      var asesor = new Asesor();
      asesor.idPrestamista = params.idPrestamista;
      asesor.idAsesor = params.idAsesor;

      try {
        var asesorStored = await asesor.save();
        return res.status(200).send({
          status: 'success',
          asesor: asesorStored
        });
      } catch (err) {
        return res.status(404).send({
          status: 'error',
          message: 'El asesor no se ha guardado ' + err
        });
      }
    } else {
      return res.status(500).send({
        status: 'error',
        message: 'Datos invalidos!'
      });
    }
  },

  getAsesor: async (req, res) => {
    try {
        var asesor = await Asesor.find({});
        return res.status(200).send({
          status: 'success',
          asesor
        });
      } catch (err) {
        return res.status(404).send({
          status: 'error',
          message: 'No hay asesores para mostrar! ' + err
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