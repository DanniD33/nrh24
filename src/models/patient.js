const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PatientSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  insuranceProvider: {
    type: String,
    required: false
  },
  appointments: {
    type: Schema.Types.ObjectId,
    ref: 'Appointment',
    required: false
  }
});

const Patient = mongoose.model("patients", PatientSchema);

module.exports = { Patient };
