const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const notesRouter = require('./routes/router');
require('dotenv').config();

const port = process.env.PORT || 5000;
const clientPath = path.join(__dirname, 'client');
const app = express();

app.use(bodyParser.json());
app.use('/api', notesRouter);
app.use(express.static(clientPath));

/*const options = {
    replicaSet: {
        socketOptions: {
            keepAlive: 1,
            connectTimeoutMS: 3000,
            socketTimeoutMS: 0
        }
    }
};*/

/*mongoose.connect(process.env.DB, options, function(err, db){
    if(err){
        console.log(err);
    } else {
        db.collections(function(err, collections) {
            collections.forEach(function(coll) {
                console.log(coll.s.name);
            });
        });
    }
})*/

mongoose.connect(process.env.DBL)
    .then(() => console.log('Master DB is connected'))
    .catch(err => console.error(err));

app.listen(port, () => {
    console.log(`Server has been started on port ${port}`)
});