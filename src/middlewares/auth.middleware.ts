import { NextFunction, Request, Response } from "express";
import { getUserData, IUserToken } from "../untils/jwt";

export interface IAuthRequest extends Request {
    user?: IUserToken;
}

export default (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers?.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized', data: null });
    };

    const [prefix, tokenValue] = token.split(' ');

    if (!(prefix === 'Bearer' && tokenValue)) {
        return res.status(401).json({ message: 'Unauthorized', data: null });
    };

    const user = getUserData(tokenValue);

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized', data: null });
    };
    
    (req as IAuthRequest).user = user;
    next();




};