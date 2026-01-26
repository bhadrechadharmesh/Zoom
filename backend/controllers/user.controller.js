import { User } from "../models/user.model.js";
import httpStatus from "http-status";
import bcrypt, {hash} from "bcrypt";
import crypto from "crypto";

const login = async(req,res)=>{

    const {username,password} = req.body; 

    if(!username || !password) {
        return res.status(400).json({msg:"provide complete details"})
    }
    try{
        const user = await User.findOne({username})

        if(!user) {
            return res.status(httpStatus.NOT_FOUND).json({msg:"user not found"});
        }

        if(bcrypt.compare(password,user.password)){
            let token = crypto.randomBytes(20).toString("hex");

            user.token = token ;
            await user.save();

            return res.status(httpStatus.OK).json({token:token});
        } else{
            return res.status(httpStatus.UNAUTHORIZED).json({msg:"invalid credentials"});
        }

    } catch(e){
        return res.status(500).json({msg:"something went wrong"});
    }
}


const register = async (req, res)=>{
    const {name,username,password} = req.body;

    try{
        const existingUser = await User.findOne({username});
        if(existingUser) {
            return res.status(httpStatus.FOUND).json({msg:"user alreay exists"});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({
            name:name,
            username:username,
            password:hashedPassword
        })

        await newUser.save();

       return res.status(httpStatus.CREATED).json({msg:"user registered"});
    } catch(e){
        console.log(e.msg);
        res.json({msg:"something went wrong"});
    }
}

export {login,register}