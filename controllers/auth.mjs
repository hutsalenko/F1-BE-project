import '../loggers.mjs';
import winston from 'winston';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.mjs';

const loginLogger = winston.loggers.get('Login');
const errorLogger = winston.loggers.get('Error');

export async function createUser(req, res) {
    const { email, firstName, lastName, password } = req.body;

    try {
        const existedUser = await UserModel.findOne({ email });

        if (existedUser) {
            return res.status(500).json({ error: 'User already exist' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await UserModel.create({
            email,
            firstName,
            lastName,
            password: hashedPassword,
        });

        res.status(201).json({ message: 'Successfully created user' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

export async function loginUser(req, res) {
    const { email, password } = req.body;

    try {
        const existedUser = await UserModel.findOne({ email });

        if (!existedUser) {
            errorLogger.info('Login error', { email, error: 'A user with this email could not be found.' });
            return res.status(500).json({ error: 'A user with this email could not be found.' });
        }

        const isCorrectPassword = await bcrypt.compare(password, existedUser.password);

        if (!isCorrectPassword) {
            errorLogger.info('Login error', { email, error: 'Wrong password!' });
            return res.status(500).json({ error: 'Wrong password!' });
        }

        const token = jwt.sign(
            {
                email: existedUser.email,
                userId: existedUser._id.toString(),
            },
            process.env.SECRET,
            { expiresIn: process.env.TOKEN_EXPIRES_IN }
        );

        loginLogger.info('User login', {
            method: req.method,
            endpoint: req.url,
            email,
            origin: req.headers.origin,
            deviceInfo: req.headers['user-agent'],
        });

        res.status(200).json({
            token: token,
            userId: existedUser._id.toString(),
            message: 'Successfully created user',
        });
    } catch (err) {
        errorLogger.info('Login error', err);
        res.status(500).json({ error: err });
    }
}
