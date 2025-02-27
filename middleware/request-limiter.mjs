import { RateLimiter } from 'limiter';

const limiter = new RateLimiter({ tokensPerInterval: 180, interval: 'hour', fireImmediately: true });

export const requestLimiter = async (req, res, next) => {
    const remainingRequests = await limiter.removeTokens(1);

    if (remainingRequests < 0) {
        return res.status(429).json({ error: 'Too many requests, try again later.' });
    }
    next();
};
