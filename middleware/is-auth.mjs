import jwt from 'jsonwebtoken';
import { Base64 } from 'js-base64';

export const isAuth = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return res.status(401).json({ error: 'Not authenticated.' });
    }
    const token = Base64.decode(authHeader.split(' ')[1]);
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.SECRET);
    } catch (err) {
        return res.status(500).json({ error: err });
    }
    if (!decodedToken) {
        return res.status(401).json({ error: 'Not authenticated.' });
    }

    req.userId = decodedToken.userId;
    next();
};
