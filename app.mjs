import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import helmet from 'helmet';
import { join } from 'path';
import { connect } from 'mongoose';
import { init } from './socket.mjs';
import { checkDirname } from './helpers/check-dirname.mjs';
import { allowCors } from './middleware/allow-cors.mjs';
import { errorHandler } from './middleware/error-handler.mjs';

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

import { driversRoutes } from './routes/drivers.mjs';
import { driverRoutes } from './routes/driver.mjs';
import { userRoutes } from './routes/user.mjs';
import { authRoutes } from './routes/auth.mjs';
import { postRoutes } from './routes/post.mjs';

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use('/images', express.static(join(checkDirname(import.meta.url), 'images')));
app.use(allowCors);

app.use(driversRoutes);
app.use(driverRoutes);
app.use(userRoutes);
app.use(authRoutes);
app.use(postRoutes);

app.use(errorHandler);

connect(process.env.MONGO_URL)
    .then(() => {
        const server = app.listen(8080);
        const io = init(server);
        io.on('connection', (socket) => {
            console.log('Client connected');
        });
    })
    .catch((err) => console.log(err));
