const express= require('express');
const { createServer } = require('node:http');

const app = express();
const path = require('path');
const port = process.env.PORT || 3300;


app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use(bodyParser.json());
// app.use(cors());


//get main login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'))
})

//Setting up server
app.listen(port, () => {
  console.log(`App listening on ${port}`);
});