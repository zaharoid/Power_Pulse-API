import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

const {SENDGRID_API_KEY} = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (date) => { 
    const email ={...date,ferom: "olegfedorchuk2019@gmail.com" };
    await sgMail.send(email);
    return true;
};

export default sendEmail;
