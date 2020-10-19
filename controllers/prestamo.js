'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');
var moment = require('moment');

var Prestamo = require('../models/prestamo');
var PrestamoDet = require('../models/prestamoDet');
var Asesor = require('../models/asesor');
var Cliente = require('../models/client');

var controller = {

  test: (req, res) => {
    return res.status(200).send({
      message: "Controller prestamo status ok!"
    });
  },

  save: async (req, res) => {
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
      try {
        if (params.tipoPrestamo == "3") {
          var gastoOp = 0;  
        } else {
          var gastoOp = 60000;  
        }
        var last = await Prestamo.findOne().sort({ nroPrestamo: -1 });
        var prestamo = new Prestamo(); 
        if (last == null) {
          prestamo.nroPrestamo =  1;  
        }else {
          prestamo.nroPrestamo = last.nroPrestamo + 1;
        }        
        prestamo.tipoPrestamo =  params.tipoPrestamo;  
        prestamo.ciudad =  params.ciudad;
        prestamo.vlrSol =  params.valorSol;
        prestamo.vlrApr =  params.valorApr;
        prestamo.vlrEnt = prestamo.vlrApr - gastoOp;
        prestamo.termino =  params.termino;
        prestamo.interes =  params.interes;
        prestamo.saldo =  params.valorApr;
        prestamo.fechaGrab =  moment().format('l');
        prestamo.diaPago =  params.diaPago;
        prestamo.estado = true;
        prestamo.tipoPrimas =  params.tipoPrimas;
        prestamo.vlrPrimas =  params.valorPrimas;
        prestamo.vlrMensual =  params.valorMensual;
        prestamo.idClient = params.idClient;
        prestamo.idUsuario = params.idUsuario;
        //0 ene - 11 dic 
        var hoy = moment().set('date', prestamo.diaPago).add(1, 'months').format('l');
        var saldoPrestamo = prestamo.vlrApr;   
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
        var fechaPago = moment().format('l');

        var prestamoStored = await prestamo.save();
        for (var i = 1; i <= prestamo.termino; i++) { 
          if (saldoPrestamo <= 0) {
            break;
          }       
          if (params.tipoPrestamo == "3") {
            saldoPrestamo = prestamo.vlrApr;
          } 
          var mes = moment(hoy).format('M');        
          if (i!==0) {
            aporteInteres = Math.round(saldoPrestamo * porcInteres);            
          } else {
            aporteInteres = Math.round(saldoPrestamo * porcInicial);
          } 
          if (prestamo.tipoPrimas == 1) {
            if (mes == 5 || mes == 11) {
              aporteCapital = prestamo.vlrPrimas;
            } else {
              aporteCapital = prestamo.vlrMensual;
            }
          } else if (prestamo.tipoPrimas == 2) {
            if (mes == 5) {
              aporteCapital = prestamo.vlrPrimas;
            } else {
              aporteCapital = prestamo.vlrMensual;
            }
          } else {
            if (mes == 11) {
              aporteCapital = prestamo.vlrPrimas;
            } else {
              aporteCapital = prestamo.vlrMensual;
            }
          }     
          
          vlrCuota = aporteInteres + aporteCapital;          
          saldoPrestamo = saldoPrestamo - aporteCapital;                   
          fechaPago = hoy;
          //console.log("saldoPrestamo"+ saldoPrestamo +"aporteInteres " + aporteInteres + " aporteCapital " + aporteCapital + " vlrCuota " + vlrCuota + " fechaPago " + fechaPago);          

          var prestamoDet = new PrestamoDet(); 
          prestamoDet.idPrestamo = prestamoStored._id;
          prestamoDet.nroCuota =  i;
          prestamoDet.aptInteres =  aporteInteres;
          prestamoDet.aptCapital =  aporteCapital;
          prestamoDet.vlrCuota = vlrCuota;
          prestamoDet.vlrInteres =  Math.round(saldoPrestamo * porcInteres);          
          prestamoDet.fechaPago =  fechaPago;
          prestamoDet.estado = "V";
          prestamoDet.vlrPagado = 0;
          prestamoDet.retiroCajero = 0;
          prestamoDet.entregadoCliente = 0;
          prestamoDet.saldo = 0;
          try {
            var prestamoDetStored = await prestamoDet.save();
          } catch (err) {
            return res.status(404).send({
              status: 'error',
              message: 'El detalle #' + i + err
            });
          }
          hoy = moment(hoy).add(1, 'months').format('l');
        }

        return res.status(200).send({
          status: 'success',
          prestamo: prestamoStored
        });
      } catch (err) {
        return res.status(404).send({
          status: 'error',
          message: 'El prestamo no se ha guardado ' + err
        });
      }
    /*} else {
      return res.status(500).send({
        status: 'error',
        message: 'Datos invalidos!'
      });
    }*/
  },

  getPrestamos: async (req, res) => {
    var params = req.body;
    //var idUsuario = params.id;
      //if (params.admin == 'true') {
        try {
          var prestamo = await Prestamo.find(/*{ idUsuario: idUsuario }*/);
          //var asesor = await Asesor.aggregate([{ $match: { idPrestamista: { $gte: idUsuario } } }]);
          return res.status(200).send({
            status: 'success',
            prestamo
          });
        } catch (err) {
          return res.status(404).send({
            status: 'error',
            message: 'No hay prestamos para mostrar! ' + err
          });
        }     
      /*} else {
        try {
        var prestamo = await Prestamo.find({ idUsuario: idUsuario });
        } catch (err) {
          return res.status(404).send({
            status: 'error',
            message: 'No hay prestamos para mostrar! ' + err
          });
        }  
      }*/
  },

  getPrestamo: async (req, res) => {
    var params = req.body;
    try {
      var prestamo = await Prestamo.findById({ _id: params.id });
      if (prestamo != null) {
        var cliente = await Cliente.findById({ _id: prestamo.idClient });
      } 
      try {
        if (params.cuota != null) {
          var prestamoDet = await PrestamoDet.find({idPrestamo: params.id, nroCuota:{$lte:params.cuota}});
        } else {
          var prestamoDet = await PrestamoDet.find({idPrestamo: params.id});
        }        
        return res.status(200).send({
          status: 'success',
          prestamo,
          prestamoDet,
          cliente
        });
      } catch (err) {
        return res.status(404).send({
          status: 'error',
          message: 'No hay detalle para mostrar! ' + err
        });
      }
    } catch (err) {
      return res.status(404).send({
        status: 'error',
        message: 'No hay prestamos para mostrar! ' + err
      });
    }   
  },

  getPrestamoClient: async (req, res) => {
    var params = req.body;
    try {
      var prestamo = await Prestamo.find({ "idClient": params.id });
      var cliente = await Cliente.findById({ _id: params.id });
      return res.status(200).send({
        status: 'success',
        prestamo,
        cliente
      });      
    } catch (err) {
      return res.status(404).send({
        status: 'error',
        message: 'No hay prestamos para mostrar! ' + err
      });
    }   
  },

  getPrestamoDet: async (req, res) => {
    try {
      var params = req.body;
      var prestamoDet = await PrestamoDet.find({"idPrestamo": params.id});
      return res.status(200).send({
        status: 'success',
        prestamoDet
      });
    } catch (err) {
      return res.status(404).send({
        status: 'error',
        message: 'No hay prestamos para mostrar! ' + err
      });
    }   
  },

  updatePrestDet: async (req, res) => {
    //Recoger los datos que llegan por put
    var params = req.body;
    try {
      var params = req.body;
      var prestamo = await Prestamo.findById({_id: params.idPrestamo});     
    } catch (err) {
      return res.status(404).send({
        status: 'error',
        message: 'No hay prestamos para mostrar! ' + err
      });
    }   

    params.saldo = prestamo.saldo - params.vlrPagado;

    try {
      var params = req.body;
      var prestamo = await Prestamo.findByIdAndUpdate({_id: params.idPrestamo}, { saldo: params.saldo}, { new: true });     
    } catch (err) {
      return res.status(404).send({
        status: 'error',
        message: 'No hay prestamos para mostrar! ' + err
      });
    }

    //Validar datos
    try {
      var validate_id = !validator.isEmpty(params._id);
    } catch (err) {
      return res.status(500).send({
        status: 'error',
        message: 'faltan datos por enviar'
      });
    }

    if (validate_id) {
      //Find and update
      try {
        var params = req.body;
        var prestamoDet = await PrestamoDet.findByIdAndUpdate({ _id: params._id }, params, { new: true });
        return res.status(200).send({
          status: 'success',
          prestamoDet
        });
      } catch (err) {
        return res.status(404).send({
          status: 'error',
          message: 'No hay prestamos para mostrar! ' + err
        });
      }   
    } else {
      return res.status(404).send({
        status: 'error',
        message: 'Datos invalidos!'
      });
    }
  },

  delete: async (req, res) => {
    var params = req.body;    
    var idPrestamo = params.id;

    try {
      var prestamoCount = await PrestamoDet.countDocuments({ idPrestamo: idPrestamo, estado: 'L' }); 
      if (prestamoCount >= 1) {
        return res.status(404).send({
          status: 'error',
          message: 'No puede eliminar el prestamo, existen cuotas liquidadas!'
        });
      }
    } catch (error) {
      //No hago nada
    }

    try {
      var prestamooRemoved = await Prestamo.findOneAndDelete({ _id: idPrestamo });
      try {        
        var prestamoDetoRemoved = await PrestamoDet.deleteMany({ idPrestamo: idPrestamo });        
      } catch (err) {
        return res.status(404).send({
          status: 'error',
          message: 'Error al eliminar el detalle del prestamo! ' + err
        });
      } 
      return res.status(200).send({
        status: 'success',
        prestamooRemoved
      });
    } catch (err) {
      return res.status(404).send({
        status: 'error',
        message: 'Error al eliminar el prestamo! ' + err
      });
    }
  }
};//End controller

module.exports = controller;