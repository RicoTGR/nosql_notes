const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const postRouter = require('./routes/router');
require('dotenv').config();

const port = process.env.PORT || 5000;
const clientPath = path.join(__dirname, 'client');
const app = express();

app.use(bodyParser.json());
app.use('/api/post', postRouter);
app.use(express.static(clientPath));

mongoose.connect(process.env.DB)
    .then(() => console.log('Master DB is connected'))
    .catch(err => console.error(err));

app.listen(port, () => {
    console.log(`Server has been started on port ${port}`)
});