import dotenv from 'dotenv';
dotenv.config();

export const PORT: number = Number(process.env.PORT) || 3000;

export const DATABASE_URL = process.env.DATABASE_URL || '';
export const SECRET = process.env.SECRET || '';
export const EMAIL_SMTP_SECURE: boolean = Boolean(process.env.EMAIL_SMTP_SECURE) || false;
export const EMAIL_SMTP_PASS: string = process.env.EMAIL_SMTP_PASS || '';
export const EMAIL_SMTP_USER: string = process.env.EMAIL_SMTP_USER || '';
export const EMAIL_SMTP_PORT: number = Number(process.env.EMAIL_SMTP_PORT) || 465;
export const EMAIL_SMTP_HOST: string = process.env.EMAIL_SMTP_HOST || '';
export const EMAIL_SMTP_SERVICE_NAME: string = process.env.EMAIL_SMTP_SERVICE_NAME || '';
export const CLIENT_HOST: string = process.env.CLIENT_HOST || 'http://localhost:3000';
