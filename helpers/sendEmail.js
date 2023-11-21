import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

const {SENDGRID_API_KEY} = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => { 
    const email ={...data, from: "olegfedorchuk2019@gmail.com" };
    await sgMail.send(email);
    return true;
};

export default sendEmail;
