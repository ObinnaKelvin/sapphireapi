import User from '../models/User.js';
import OTP from '../models/OTP.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

export const register = async (req, res) => {

    try {
        //1.Check if any user exists
        //2. If exist set the newuser id
        //3. Else if not exist, set newuserid =1
        let newUserid;
        const isExistLastUser = await User.find()//1.Check if any user exists
        if(isExistLastUser[0] === undefined) {
            newUserid = 1; //3. Else if not exist, set newuserid =1
        }
        else {
            const lastUserId = await User.find({}, {user_id: 1, _id:0}).sort({_id:-1}).limit(1)
            newUserid = lastUserId[0].user_id + 1;  //2. If exist set the newuser id
        }

        //console.log("New User Id:", newUserid); //What is the new user id
        const salt = bcrypt.genSaltSync(12);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            user_id: newUserid,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            email: req.body.email,
            password: hash,
            gender: req.body.gender,
            phone: req.body.phone,
            role:req.body.role
        })

        const isExist = await User.findOne({firstname: req.body.firstname})
        if(isExist) return res.status(404).json("User already exists 🙅‍♂️")
        await newUser.save()
        res.status(200).json(newUser)
        console.log(`User "${newUser.firstname}" has now been created!🙋‍♂️`)

        
    } catch (error) {
        console.log(error)
    }

}


export const login = async(req, res) => {
    try {
        const user = await User.findOne({username: req.body.username})
        //console.log(user)

        if(!user) return res.status(404).json("User not found 🙅‍♂️")

        const isPasswordCorrect = await bcrypt.compareSync(req.body.password, user.password)
        if (!isPasswordCorrect) return res.status(404).json("User or password incorrect 🙅‍♂️")

        const token = jwt.sign({ id:user._id, isAdmin:user.isAdmin }, process.env.JWT, {expiresIn: '1d'})  //'1d' means Token will expire in one day
        // I generated my secret key above using 
        //openssl rand -base64 32

        const {password, isAdmin, ...otherDetails} = user._doc
        res.cookie("access_token", token, {
            httpOnly: true,
        })
        .status(200).json({details: {...otherDetails}, isAdmin})
        console.log(`${user._doc.firstname} logged in successfully!🙋‍♂️`)

    } catch (error) {
        console.log(error)
    }
}