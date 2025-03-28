import jwt from 'jsonwebtoken';
import {User} from '../models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: 'You must be logged in' });
    }

    const token = authorization.split(' ')[1];

    try {
        const { _id } = jwt.verify(token, process.env.SECRET);
        const user = await User.findById(_id);
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Request is not authorized' });
    }
};

export default requireAuth;
