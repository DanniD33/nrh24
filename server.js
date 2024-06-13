const express= require('express');
const { createServer } = require('node:http');

const app = express();
const path = require('path');
const port = process.env.PORT || 3000;