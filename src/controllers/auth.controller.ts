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
    password: yup.string().required().min(6, "Password must be at least 6 characters").test('at-least-one-uppercase', 'Password must contain at least one uppercase letter', (value) => {
        if (!value) return false;
        const regex = /^(?=.*[A-Z])/;
        return regex.test(value);
    }).test('at-least-one-number', 'Password must contain at least one number', (value) => {
        if (!value) return false;
        const regex = /^(?=.*\d)/;
        return regex.test(value);
    }),
    confirmPassword: yup.string().required().oneOf([yup.ref('password')], "Passwords must match")
});


export default {
    register: async (req: Request, res: Response) => {
        /**
        #swagger.tags = ['Auth']
        #swagger.requestBody = {  
            required: true,
            schema: {$ref: "#/components/schemas/RegisterRequest"}   
        }
        */
        const { fullName, username, email, password, confirmPassword } = req.body as TRegister;

        try {
            await regisrerValidationSchema.validate({ fullName, username, email, password, confirmPassword });

            const result = await UserModel.create({ fullName, username, email, password });
            res.status(201).json({ message: 'User registered successfully', data: result });


        } catch (error) {
            const err = error as unknown as Error
            console.error(err.message);
            res.status(500).json({ message: err.message, data: null });

        }
    },

    login: async (req: Request, res: Response) => {
        /**
         #swagger.tags = ['Auth']
         #swagger.requestBody = {  
            required: true,
            schema: {$ref: "#/components/schemas/LoginRequest"}   
         }
         */

        try {
            const { identifier, password } = req.body as unknown as TLogin;

            const user = await UserModel.findOne({ $or: [{ email: identifier }, { username: identifier }], isActivated: true });

            if (!user) {
                return res.status(404).json({ message: 'User not found', data: null });
            }

            // validate password
            const validatePassword: boolean = encrypt(password) === user.password;

            if (!validatePassword) {
                return res.status(400).json({ message: 'Invalid password', data: null });
            }

            const token = genereToken({ id: user.id, role: user.role });

            res.status(200).json({ message: 'User logged in successfully', data: token });
        } catch (error) {
            const err = error as unknown as Error
            console.error(err.message);
            res.status(500).json({ message: err.message, data: null });
        }
    },

    async me(req: IAuthRequest, res: Response) {
        /**
         #swagger.tags = ['Auth']
         #swagger.security = [{
         "bearerAuth": []
         }]
         */
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
            res.status(500).json({ message: err.message, data: null });

        }
    },

    async activation(req: Request, res: Response) {
        /**
         #swagger.tags = ['Auth']
         #swagger.requestBody = {  
            required: true,
            schema: {
                $ref: "#/components/schemas/ActivationRequest"
            }   
         }
         */
        try {
            const { code } = req.body as { code: string };

            const user = await UserModel.findOneAndUpdate({ activationCode: code }, { isActivated: true}, { new: true });

            if (!user) {
                return res.status(404).json({ message: 'Invalid activation code', data: null });
            }

            await user.save();

            res.status(200).json({ message: 'User activated successfully', data: user });

        } catch (error) {
            const err = error as unknown as Error
            console.error(err.message);
            res.status(500).json({ message: err.message, data: null });
        }
    }
};
