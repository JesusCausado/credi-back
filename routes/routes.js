'use strict'

var express = require('express');
var middleware = require('../middleware/middleware');
var testController = require('../controllers/noAuth');
var userController = require('../controllers/user');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './upload/articles' });

// No autentication routes
router.post('/login', testController.login);

// test routes
router.get('/userTest', userController.test);

//real routes
router.post('/save-user', middleware.ensureAuthenticated, userController.save);

module.exports = router;