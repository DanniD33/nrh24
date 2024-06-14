const express = require("express");
const mongoose = require("mongoose");

// require('newrelic');

const app = express();
app.use(express.json());

const patientRoute = require("./routes/patient.route");
const appointmentRoute = require("./routes/appointment.route");
const path = require("path");
app.use(patientRoute);
app.use(appointmentRoute);

// app.use((err, req, res) => {
//   if (!err.statusCode) err.statusCode = 500;
//   res.status(err.statusCode).json({
//     message: err.message,
//     statusCode: err.statusCode
//   })
// })

app.get('/home', (req, res) => {
  // res.sendFile('Hello from Homepage');
  res.sendFile(path.join(__dirname, './view/index.html'));
});

app.get('/login', (req, res) => {
  // res.sendFile('Hello from Homepage');
  res.sendFile(path.join(__dirname, './view/singup.html'));
});

app.get('/', (req, res) => {
  // res.sendFile('Hello from Homepage');
  res.sendFile(path.join(__dirname, './view/profile.html'));
});

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

app.use(express.static(path.join(__dirname, './view')));
// app.use(express.static(path.join(__dirname, './view')));
// app.use(express.static(path.join(__dirname, './view')));

start();