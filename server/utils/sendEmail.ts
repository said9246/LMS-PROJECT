require("dotenv").config({ path: "./config/config.env" });
import { Template } from "./../node_modules/@types/ejs/index.d";

import nodmailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";
interface IEmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

const sendEmail = async (options: IEmailOptions): Promise<void> => {
  const transporter: nodmailer.Transporter = nodmailer.createTransport({
    host: process.env.SMTP_HOST as string,
    port: process.env.SMTP_PORT || 587,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const { email, subject, template, data } = options;
  const templatePath = path.join(__dirname, "../mails/", template);
  const html = await ejs.renderFile(templatePath, { data });
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: subject,
    html: html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
