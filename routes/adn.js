const express = require('express');
const AdnController = require('../controllers/AdnController');
const Checker = require('../middelware/Checker');
// get express router to create new rotes into the app
const adnRoutes = express.Router();
//route declaration and action is going to excecute 
adnRoutes.post('/mutation', Checker.checkAdn, AdnController.hasMutation);

module.exports = [adnRoutes];