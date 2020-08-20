'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');

var Prestamo = require('../models/prestamo');
var PrestamoDet = require('../models/prestamoDet');

var controller = {

  test: (req, res) => {
    return res.status(200).send({
      message: "Controller prestamo status ok!"
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
      var gastoOp = 60000;  
      var prestamo = new Prestamo(); 
      prestamo.nroPrestamo =  1;  
      prestamo.tipoPrestamo =  params.tipoPrestamo;  
      prestamo.ciudad =  params.ciudad;
      prestamo.vlrSol =  params.valorSol;
      prestamo.vlrApr =  params.valorApr;
      prestamo.vlrEnt = prestamo.vlrApr - gastoOp;
      prestamo.termino =  params.termino;
      prestamo.interes =  params.interes;
      prestamo.fechaGrab =  new Date();
      prestamo.diaPago =  params.diaPago;
      prestamo.estado = true;
      prestamo.idClient = params.idClient;
      //0 ene - 11 dic
      var hoy = new Date();   
      var saldoPrestamo = prestamo.vlrApr;
      var cMensual = 100000;   
      var cSemestral = 500000;      
      var comision = 3;
      var porComision = comision/100;
      var porcInteres = prestamo.interes/100;
      var intInicial = prestamo.interes - comision;
      var porcInicial = intInicial/100;
      var vlrComision = Math.round(prestamo.vlrApr * porComision);           
      //Aux
      var aporteInteres = 0;
      var aporteCapital = 0;
      var vlrCuota = 0;
      var fechaPago = new Date();

      /*try {
        var prestamoStored = await prestamo.save();
        return res.status(200).send({
          status: 'success',
          prestamo: prestamoStored
        });
      } catch (err) {
        return res.status(404).send({
          status: 'error',
          message: 'El prestamo no se ha guardado ' + err
        });
      }*/
      
      prestamo.save((err, prestamoStored) => {
        if (err || !prestamoStored) {
          return res.status(404).send({
            status: 'error',
            message: 'El prestamo no se ha guardado ' + err + prestamoStored
          });
        }

        for (var i = 1; i <= prestamo.termino; i++) {                  
          var mes = hoy.getMonth();
          console.log(mes);
          
          if (i!=0) {
            aporteInteres = Math.round(saldoPrestamo * porcInteres);
          } else {
            aporteInteres = Math.round(saldoPrestamo * porcInicial);
          }        
          if (mes == 5 || mes == 11) {
            aporteCapital = cSemestral;
          } else {
            aporteCapital = cMensual;
          }
          vlrCuota = aporteInteres + aporteCapital;
          saldoPrestamo = saldoPrestamo - aporteCapital;
          fechaPago = hoy;
          console.log("aporteInteres " + aporteInteres + " aporteCapital " + aporteCapital + " vlrCuota " + vlrCuota + " fechaPago " + fechaPago);          

          var prestamoDet = new PrestamoDet(); 
          prestamoDet.idPrestamo = prestamoStored._id;
          prestamoDet.nroCuota =  i;
          prestamoDet.aptInteres =  aporteInteres;
          prestamoDet.aptCapital =  aporteCapital;
          prestamoDet.vlrCuota = vlrCuota;
          prestamoDet.vlrInteres =  Math.round(saldoPrestamo * porcInteres);
          prestamoDet.fechaPago =  fechaPago;
          prestamoDet.estado = "V";

          prestamoDet.save((err2, prestamoDetStored) => {
            if (err2 || !prestamoDetStored) {
              return res.status(404).send({
                status: 'error',
                message: 'El detalle #' + i
              });
            }
          })
          hoy.setMonth(hoy.getMonth() + 1);
        }

        return res.status(200).send({
          status: 'success',
          prestamo: prestamoStored
        });
      })

    /*} else {
      return res.status(500).send({
        status: 'error',
        message: 'Datos invalidos!'
      });
    }*/
  },

  getPrestamo: (req, res) => {
    Prestamo.find({}, (err, prestamo) => {
      if (err || !prestamo) {
        return res.status(404).send({
          status: 'error',
          message: 'No hay menus para mostrar!'
        });
      }

      return res.status(200).send({
        status: 'success',
        prestamo
      });
    })    
  },

  getPrestamo: (req, res) => {
    Prestamo.find({}, (err, prestamo) => {
      if (err || !prestamo) {
        return res.status(404).send({
          status: 'error',
          message: 'No hay menus para mostrar!'
        });
      }

      return res.status(200).send({
        status: 'success',
        prestamo
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
    var idPrestamo = params.id;  

    Prestamo.findOneAndDelete({ _id: idPrestamo }, (err, prestamooRemoved) => {
      if (err || !prestamooRemoved) {
        return res.status(500).send({
          status: 'error',
          message: 'Error al borrar el articulo!'
        });
      }
      PrestamoDet.deleteMany({ idPrestamo: idPrestamo }, (err, prestamoDetoRemoved) => {
        if (err || !prestamoDetoRemoved) {
          return res.status(500).send({
            status: 'error',
            message: 'Error al borrar el articulo!'
          });
        }
      })

      return res.status(200).send({
        status: 'success',
        prestamo: prestamooRemoved
      });
    })
  }
};//End controller

module.exports = controller;