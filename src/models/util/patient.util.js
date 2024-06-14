require("../patient");
const modelToDto = (patient) => {
    return {
        id: patient._id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        dateOfBirth: patient.dob,
        insuranceProvider:  patient.insuranceProvider,
        appointments: patient.appointments
    }
}

module.exports = {
    modelToDto
}