import {HttpErr} from "../helpers/index.js";
import MongusModel, {userCalcSchema} from "../models/calcUser.js"
import {ctrlWrapper} from "../decorators/index.js";

 const schow = async(req, res)=>{
    
    const {error, value} = userCalcSchema.validate(req.body);
        if(error){
            return res.status(400).json({error: error.details[0].message})
        }
res.status(200).json({message: 'Validation success', data: value})
}

 const add = async (req, res) => {
    
    const {_id: owner} = req.user;
    const result = await MongusModel.create({...req.body, owner});
    res.status(201).json(result)
}

export default {
    schow: ctrlWrapper(schow),
    add: ctrlWrapper(add),
   
}

