import User from "../models/user.js";
import { HttpErr } from "../helpers/index.js"
import { ctrlWrapper } from "../decorators/index.js";

const signup = async(req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(user){
        throw HttpErr(409, `${email} already in use`)
    }

    const newUser = await User.create(req.body);
    res.status(201).json({
        name: newUser.name,
        email: newUser.email,
    })
}
export default {
    signup: ctrlWrapper(signup),
}