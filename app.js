// Fast, unopinionated, minimalist web framework for node.
const express = require('express');

// Node.js body parsing middleware.
const bodyParser = require('body-parser');

// Mongoose is a MongoDB object modeling tool
// designed to work in an asynchronous environment.
const mongoose = require('mongoose');

// Dotenv is a zero-dependency module that loads
// environment variables from a .env file into process.env
require('dotenv').config();

// The port on which the application runs
const port = process.env.PORT || 5000;

// The path module provides utilities
// for working with file and directory paths.
const path = require('path');

// The path to the folder where the files of the
// client part of the application are stored.
const clientPath = path.join(__dirname, 'client');

// Mounting a file that stores HTTP requests.
const router = require('./routes/router');

// Instance of the application
const app = express();

app.use(bodyParser.json());
app.use('/api', router);
app.use(express.static(clientPath));

// Connect to a local database
mongoose.connect(process.env.DBL)
    .then(() => console.log('Local DB is connected'))
    .catch(err => console.error(err));

// Listens for incoming requests on the specified port
app.listen(port, () => {
    console.log(`Server has been started on port ${port}`)
});