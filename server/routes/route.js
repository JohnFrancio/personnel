const express = require("express");
const router = express.Router();

const employeController = require('../controller/employe');
const departementController = require('../controller/departement');

// routes for Employe
router.get('/employe', employeController.getEmploye);
router.post('/authemploye', employeController.authEmploye);
router.post('/employe', employeController.insertEmploye);
router.put('/employe/:id', employeController.udpateEmploye);
router.delete('/employe/:id', employeController.deleteEmploye);

//routes for departement
router.get('/deps', departementController.getDeps);
router.post('/deps', departementController.insertDeps);
router.delete('/deps/:id', departementController.deleteDeps);

module.exports = router;