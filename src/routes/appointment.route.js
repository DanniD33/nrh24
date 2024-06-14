const express = require("express");

const router = express.Router();

const controller = require("../controllers/appointment.controller");

router.post('/patients/:id/appointments', controller.create);

router.get('/patients/:id/appointments/:appointmentId', controller.get);

router.put('/patients/:id/appointments/:appointmentId', controller.update);

router.delete('/patients/:id/appointments/:appointmentId', controller.delete);

module.exports = router;