import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

import {
    EMAIL_SMTP_HOST,
    EMAIL_SMTP_PORT,
    EMAIL_SMTP_SERVICE_NAME,
    EMAIL_SMTP_USER,
    EMAIL_SMTP_PASS,
    EMAIL_SMTP_SECURE
} from '../env';
import { promises } from 'dns';


const transporter = nodemailer.createTransport({
    service: EMAIL_SMTP_SERVICE_NAME,
    host: EMAIL_SMTP_HOST,
    port: EMAIL_SMTP_PORT,
    secure: EMAIL_SMTP_SECURE,
    auth: {
        user: EMAIL_SMTP_USER,
        pass: EMAIL_SMTP_PASS
    },
    requireTLS: true
});

export interface ISendMail {
    from: string;
    to: string;
    subject: string;
    html: string;
}

export const sendMail = async ({...mailParams}: ISendMail) => {
    try {
        const result = await transporter.sendMail({
            // from: from,
            // to: to,
            // subject: subject,
            // html: html,
            ...mailParams
        });
        return result;
    } catch (error) {
        return error;
    }
}

export const renderMailHtml = async (template: string, data: any): Promise<string> => {
    const content = await ejs.renderFile(path.join(__dirname, `./templates/${template}.ejs`), data);

    return content as string;
};

