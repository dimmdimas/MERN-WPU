import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { Types } from 'mongoose';
import { SECRET } from './env';

export interface IUserToken extends Omit<User, 'password' | "activationCode" | "isActivated" | "email" | "fullName" | "profilePicture" | "username"> {
    id?: Types.ObjectId;
}

export const genereToken = (user: IUserToken): string => {
    const token = jwt.sign(user, SECRET, { expiresIn: '1h' });

    return token;
};

export const getUserData = (token: string) => {
    const user = jwt.verify(token, SECRET) as IUserToken;

    return user;
};