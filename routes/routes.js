'use strict'

var express = require('express');
var middleware = require('../middleware/middleware');
var testController = require('../controllers/noAuth');
var userController = require('../controllers/user');
var typeUserController = require('../controllers/typeUser');
var menuController = require('../controllers/menu');
var optionController = require('../controllers/option');
var optionUserController = require('../controllers/optionUser');
var clientController = require('../controllers/client');
var prestamoController = require('../controllers/prestamo');
var asesorController = require('../controllers/asesor');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './upload/articles' });

// No autentication routes
router.post('/login', testController.login);

// test routes
router.get('/user-test', middleware.ensureAuthenticated, userController.test);
router.get('/typeUser-test', middleware.ensureAuthenticated, typeUserController.test);
router.get('/menu-test', middleware.ensureAuthenticated, menuController.test);
router.get('/option-test', middleware.ensureAuthenticated, optionController.test);
router.get('/option-user-test', middleware.ensureAuthenticated, optionUserController.test);
router.get('/client-test', middleware.ensureAuthenticated, clientController.test);
router.get('/asesor-test', middleware.ensureAuthenticated, asesorController.test);

//real routes
router.post('/save-user', middleware.ensureAuthenticated, userController.save);
router.post('/users/', middleware.ensureAuthenticated, userController.getUsers);
router.post('/user', middleware.ensureAuthenticated, userController.getUser);
router.post('/update-user', middleware.ensureAuthenticated, userController.update);
/*router.delete('/article/:id', middleware.ensureAuthenticated, articleController.delete);
router.post('/upload-image/:id', middleware.ensureAuthenticated, md_upload, articleController.upload);
router.get('/get-image/:image', middleware.ensureAuthenticated, articleController.getImage);
router.get('/search/:search', middleware.ensureAuthenticated, articleController.search);*/

router.post('/save-typeUser', middleware.ensureAuthenticated, typeUserController.save);

router.post('/save-menu', middleware.ensureAuthenticated, menuController.save);
router.post('/menus', middleware.ensureAuthenticated, menuController.getMenus);

router.post('/save-option', middleware.ensureAuthenticated, optionController.save);
router.post('/options', middleware.ensureAuthenticated, optionController.getOptions);

router.post('/save-option-user', middleware.ensureAuthenticated, optionUserController.save);
//router.post('/options', middleware.ensureAuthenticated, optionController.getOptions);

router.post('/save-client', middleware.ensureAuthenticated, clientController.save);
router.post('/clients', middleware.ensureAuthenticated, clientController.getClients);
router.delete('/client', middleware.ensureAuthenticated, clientController.delete);

router.post('/save-prestamo', middleware.ensureAuthenticated, prestamoController.save);
router.post('/prestamos', middleware.ensureAuthenticated, prestamoController.getPrestamos);
router.post('/prestamos-client', middleware.ensureAuthenticated, prestamoController.getPrestamoClient);
router.post('/prestamo', middleware.ensureAuthenticated, prestamoController.getPrestamo);
router.post('/prestamos-det', middleware.ensureAuthenticated, prestamoController.getPrestamoDet);
router.post('/update-prestamo', middleware.ensureAuthenticated, prestamoController.updatePrestDet);
router.delete('/prestamo', middleware.ensureAuthenticated, prestamoController.delete);

router.post('/save-asesor', middleware.ensureAuthenticated, asesorController.save);
router.post('/asesores', middleware.ensureAuthenticated, asesorController.getAsesor);

module.exports = router;