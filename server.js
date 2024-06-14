const express= require('express');
const { createServer } = require('node:http');

const app = express();
const path = require('path');
const port = process.env.PORT || 3300;
const userRoutes = require('./submissions/routes/user.js'); 


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());


//get main login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

//create endpoint for user registration 
app.get('/user/register', userRoutes, (req, res) => {

});

// create endpoint to validate user sign in creds
app.get('/user/login', userRoutes, (req, res) => {
  res.redirect('/user/id');
});

// app.get('/user/id', userRoutes, (req, res) => {

// })


//create error handler
app.use(function (err, req, res, next) {
  console.error(err.stack); 
  res.status(500).send('Something broke!');
});



//Setting up server
app.listen(port, () => {
  console.log(`App listening on ${port}`);
});

