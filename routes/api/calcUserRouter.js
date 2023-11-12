import express from "express";

import userCalcSchama from "../../models/calcUser.js";

const calcUserRouter = express.Router();


calcUserRouter.post('/', async(req, res)=>{
   
    const {error, value} = userCalcSchama.validate(req.body);
    console.log('error', error);//
    console.log('value', value);//
        if(error){
            return res.status(400).json({error: error.details[0].message})
        }
res.status(200).json({message: 'Validation success', data: value})
    
})

export default calcUserRouter;
