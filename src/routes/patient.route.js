const express = require("express");

const router = express.Router();

const controller = require("../controllers/patient.controller");

router.get('/patients', controller.all);

router.post('/patients', controller.create);

router.get('/patients/:id', controller.get);

router.put('/patients/:id', controller.update);

router.delete('/patients/:id', controller.delete);

router.post('/models/', controller.model);

module.exports = router;