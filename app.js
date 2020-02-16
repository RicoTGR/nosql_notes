const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const notesRouter = require('./routes/router');
require('dotenv').config();

const port = process.env.PORT || 5000;
const clientPath = path.join(__dirname, 'client');
const app = express();

app.use(bodyParser.json());
app.use('/api', notesRouter);
app.use(express.static(clientPath));

mongoose.connect(process.env.DBL)
    .then(() => console.log('Local DB is connected'))
    .catch(err => console.error(err));

app.listen(port, () => {
    console.log(`Server has been started on port ${port}`)
});