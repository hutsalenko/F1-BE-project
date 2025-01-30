require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const driverRoutes = require('./routes/drivers');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, 'images')));
app.use(cors({ origin: ['http://localhost:3000'] }));

app.use(driverRoutes);
app.use(userRoutes);
app.use(authRoutes);

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(8080);
    })
    .catch((err) => console.log(err));
