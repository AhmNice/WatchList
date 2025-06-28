import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config();
const { MAIL_USER, MAIL_PASS } = process.env;

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS
  }
});