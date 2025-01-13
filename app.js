const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const MONGODB_URI =
    'mongodb+srv://ivangutsalenko92:70biPAYmrs24HVGz@cluster0.bsq4a.mongodb.net/formula1?retryWrites=true&w=majority&appName=Cluster0';

const driverRoutes = require('./routes/drivers');

app.use(cors({ origin: ['http://localhost:3000'] }));

app.use(driverRoutes);

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        app.listen(8080);
    })
    .catch((err) => console.log(err));
