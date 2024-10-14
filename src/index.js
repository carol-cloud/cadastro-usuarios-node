

require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoute'); 
const cors = require('cors'); 
const app = express();

app.use(cors({
    origin: 'http://localhost:3000', 
  }));
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/user', userRoutes);

module.exports = app; 
