import { Request, Response } from 'express';
import * as yup from 'yup';
import UserModel from '../models/user.model';
import { encrypt } from '../untils/encryption';
import { genereToken } from '../untils/jwt';
import { IAuthRequest } from '../middlewares/auth.middleware';

type TRegister = {
    fullName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

type TLogin = {
    identifier: string;
    password: string;
};

const regisrerValidationSchema = yup.object().shape({
    fullName: yup.string().required(),
    username: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
    confirmPassword: yup.string().required().oneOf([yup.ref('password')], "Passwords must match")
});


export default {
    register: async (req: Request, res: Response) => {
        const { fullName, username, email, password, confirmPassword } = req.body as TRegister;

        try {
            await regisrerValidationSchema.validate({ fullName, username, email, password, confirmPassword });

            const checkUser = await UserModel.findOne({ $or: [{ email }, { username }] });
            const result = await UserModel.create({ fullName, username, email, password });

            if (checkUser) {
                throw new Error('User already exists');
            } else {
                res.status(201).json({ message: 'User registered successfully', data: result });
            }

        } catch (error) {
            const err = error as unknown as Error
            console.error(err.message);
            res.status(500).json({ message: err.message , data: null});

        }
    },

    login: async (req: Request, res: Response) => {
        try {
            const { identifier, password } = req.body as unknown as TLogin;

            const user = await UserModel.findOne({ $or: [{ email: identifier }, { username: identifier }] });

            if (!user) {
                return res.status(404).json({ message: 'User not found', data: null });
            }
            
            // validate password
            const validatePassword: boolean = encrypt(password) === user.password;

            if (!validatePassword) {
                return res.status(400).json({ message: 'Invalid password', data: null });
            }

            const token = genereToken({id: user.id, role: user.role});

            res.status(200).json({ message: 'User logged in successfully', data: token });
        } catch (error) {
            const err = error as unknown as Error
            console.error(err.message);
            res.status(500).json({ message: err.message , data: null});
        }
    },

    async me(req: IAuthRequest, res: Response) {
        try {
            const user = req.user
            const result = await UserModel.findById(user?.id);

            if (!result) {
                return res.status(404).json({ message: 'User not found', data: null });
            }

            res.status(200).json({ message: 'Success get user data', data: result });
        } catch (error) {
            const err = error as unknown as Error
            console.error(err.message);
            res.status(500).json({ message: err.message , data: null});
            
        }
    },
};
