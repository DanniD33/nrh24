const { Patient } = require("../models/patient");
const { modelToDto}  = require("../models/util/patient.util");
const { all, children, one, create, update, deleteEntity } = require("../models/models.util");
const {Appointment} = require("../models/appointments");

exports.all = (req, res, next) => {
    all(Patient)
        .then(all => (res.status(200).json(all.map(patient => (modelToDto(patient))))))
        .catch(err => next(err));
};

exports.get = (req, res, next) => {
    one(Patient, req)
        .then(patient => {
            if (patient)
                children(Appointment, { patientId: patient._id}, req)
                    .then(appointments => {
                        res.status(200).json(Object.assign({}, modelToDto(patient), { appointments }));
                    })
            else
                res.sendStatus(404);
        })
        .catch(err => next(err));
};

exports.create = (req, res, next) => {
    const patient = new Patient({ ...req.body });
    create(patient, modelToDto, req, res, next)
        .then(created => (res.status(201).json(modelToDto(created))))
        .catch(err => next(err));
};

exports.update = (req, res, next) => {
    update(Patient, req)
        .then(_ => {
            one(Patient, req)
                .then(updated => {
                    res.status(200).json(modelToDto(updated));
                });
        })
        .catch(err => next(err));
};

exports.delete = (req, res, next) => {
    one(Patient, req)
        .then(patient => {
            if (patient)
                children(Appointment, { patientId: patient._id}, req)
                    .then(async appointments => {
                        // delete appointments
                        for (const appointment of appointments) {
                            await deleteEntity(Appointment, {
                                params: {
                                    id: appointment._id
                                }
                            })
                        }
                        // delete client
                        deleteEntity(Patient, req, res, next)
                            .then(_ => {
                                res.sendStatus(200);
                            })
                    })
            else
                res.sendStatus(404);
        })
        .catch(err => next(err));
};