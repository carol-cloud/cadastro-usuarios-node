

require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoute'); 

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/user', userRoutes);

module.exports = app; 
