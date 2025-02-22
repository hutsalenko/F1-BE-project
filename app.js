require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const allowCors = require('./middleware/allow-cors');
const errorHandler = require('./middleware/error-handler');

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

const driversRoutes = require('./routes/drivers');
const driverRoutes = require('./routes/driver');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(allowCors);

app.use(driversRoutes);
app.use(driverRoutes);
app.use(userRoutes);
app.use(authRoutes);
app.use(postRoutes);

app.use(errorHandler);

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        const server = app.listen(8080);
        const io = require('./socket').init(server);
        io.on('connection', (socket) => {
            console.log('Client connected');
        });
    })
    .catch((err) => console.log(err));
