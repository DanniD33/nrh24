const express = require("express");
const mongoose = require("mongoose");

//require('newrelic');

const app = express();
app.use(express.json());

const patientRoute = require("./routes/patient.route");
const appointmentRoute = require("./routes/appointment.route");
app.use(patientRoute);
app.use(appointmentRoute);

app.use((err, req, res) => {
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).json({
    message: err.message,
    statusCode: err.statusCode
  })
})

const start = async () => {
  try {

    await mongoose.connect(
      "mongodb+srv://renderatl:renderatl@renderatl.pwmdbgu.mongodb.net/?retryWrites=true&w=majority&appName=renderatl"
    );
    app.listen(3000, () => console.log("Server started on port 3000"));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();