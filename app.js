require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const driverRoutes = require('./routes/drivers');
const userRoutes = require('./routes/user');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({ origin: ['http://localhost:3000'] }));

app.use(driverRoutes);
app.use(userRoutes);

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(8080);
    })
    .catch((err) => console.log(err));
