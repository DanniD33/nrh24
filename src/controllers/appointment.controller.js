const { Appointment } = require("../models/appointments");
const { Patient } = require("../models/patient");

const { one, create, update, deleteEntity } = require("../models/models.util");

const modelToDto = (model) => (model);

exports.create = (req, res, next) => {
    one(Patient, req)
        .then(patient => {
            const appointment = new Appointment({
                ...req.body,
                patientId: patient.id
            });
            create(appointment, modelToDto, req, res, next)
                .then(created => (res.status(201).json(modelToDto(created))))
                .catch(err => next(err));
        })
        .catch(err => next(err));
};

exports.get = (req, res, next) => {
    one(Appointment, {
        params: {
            id: req.params.appointmentId
        }
    })
        .then(appointment => {
            if (appointment)
                res.status(200).json(appointment);
            else
                res.sendStatus(404);
        })
        .catch(err => next(err));
};

exports.update = (req, res, next) => {
    update(Appointment, {
        params: {
            id: req.params.appointmentId
        },
        body: req.body
    })
        .then(_ => {
            one(Appointment, {
                params: {
                    id: req.params.appointmentId
                }
            })
                .then(updated => {
                    res.status(200).json(modelToDto(updated));
                });
        })
        .catch(err => next(err));
};

exports.delete = (req, res, next) => {
    deleteEntity(Appointment, {
        params: {
            id: req.params.appointmentId
        }
    })
        .then(_ => {
            res.sendStatus(200);
        })
        .catch(err => next(err));
};