import User from "../models/User.js";
import Dairy from "../models/Dairy.js"
import Day from "../models/Day.js";

import jwt from "jsonwebtoken"; 
import dotenv from "dotenv";

import { HttpErr } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const createDay = async(req, res) => {
    const token = req.headers["authorization"].split(" ")[1];
    const userId = jwt.verify(token, JWT_SECRET).id;
    console.log(1, token, userId);
    console.log("------------------------------------------------");
    let day;
    try{
        day = await Day.create({owner: userId, data: new Date()})
        const dairy = await Dairy.create({ owner: userId, data: day._id });
        console.log(dairy);
    } catch(error){
        console.log(error);
    }
    console.log("------------------------------------------------");
    console.log(2, day);
    
    res.json(true)
};

export default {
    createDay: ctrlWrapper(createDay)
}
