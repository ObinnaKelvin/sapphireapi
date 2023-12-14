import User from '../models/User.js';
import OTP from '../models/Otp.js';
import otpGenerator from 'otp-generator';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import Otp from '../models/Otp.js';
import _ from 'lodash'
import nodemailer from 'nodemailer'



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
        const user = await User.findOne({email: req.body.email})
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

        //Here comes the OTP authentication
        const OTP = otpGenerator.generate(6, {
            digits: true, alphabets: false, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
        });

        const email = req.body.email;
        console.log(OTP);

        const otp = new Otp({ email: email, otp: OTP})
        const salt = await bcrypt.genSalt(10);
        otp.otp = await bcrypt.hash(otp.otp, salt);

        const result = await otp.save()
        // console.log(result)
        .then((output) => {
            const receiptEmail = output.email
            sendLoginEmailOtp(receiptEmail, OTP); //Sends email here
        });
        //return res.status(200).json("OTP sent successfully");
        console.log("OTP sent successfully");


    } catch (error) {
        console.log(error)
    }
}


export const verifyOtp = async (req, res) => {
    const otpHolder = await Otp.find({
        email: req.body.email
    }); 
    if(otpHolder.length === 0) return res.status(400).json("Sorry, the OTP has Expired!");
    const lastOtpFind = otpHolder[otpHolder.length -1];
    const formOTP = await req.body.otp;
   
    const validUser = await bcrypt.compareSync(formOTP, lastOtpFind.otp);
    //console.log("lastOtpFind:", lastOtpFind.otp)
    //const formOTP = req.body.otp;
    console.log("formOTP:", formOTP)
    //const convertOTPString = formOTP.toString()
    //const validUser = await bcrypt.compareSync(convertOTPString, lastOtpFind.otp);
    console.log("validUser:", validUser)

    if(lastOtpFind.email === req.body.email && validUser) {
        const user = new User(_.pick(req.body, ["email"]));
        //const token = user.generateJWt();
        //const result = await user.save();
        return res.status(200).json({
            message: "User Verified Successfully!"
        })
    } else {
        return res.status(400).json("OTP Validation Unsuccessfull")
    }
}

export const generateNewOTP = async (req, res) => {

    try {
        //const user = await User.find({email: req.body.email})

        //Here comes the OTP authentication
        const OTP = otpGenerator.generate(6, {
            digits: true, alphabets: false, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
        });

        const email = req.body.email;
        console.log(OTP);

        const otp = new Otp({ email: email, otp: OTP})
        const salt = await bcrypt.genSalt(10);
        otp.otp = await bcrypt.hash(otp.otp, salt);

        const result = await otp.save()
        // console.log(result)
        .then((output) => {
            const receiptEmail = output.email
            sendLoginEmailOtp(receiptEmail, OTP); //Sends email here
        });
        console.log("New OTP sent successfully");
        return res.status(200).json("New OTP sent successfully");
        
    } catch (error) {
        console.log(error)
    }
}

export const generateNewOTPForPasswordReset = async (req, res) => {

    try {
        const user = await User.findOne({email: req.body.email})
        if(!user) return res.status(404).json("User not found 🙅‍♂️")

        const OTP = otpGenerator.generate(6, {
            digits: true, alphabets: false, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
        });

        const email = req.body.email;
        console.log(OTP);

        const otp = new Otp({ email: email, otp: OTP})
        const salt = await bcrypt.genSalt(10);
        otp.otp = await bcrypt.hash(otp.otp, salt);

        const result = await otp.save()
        .then((output) => {
            const receiptEmail = output.email
            sendPasswordResetOtp(receiptEmail, OTP); //Sends email here
        });
        console.log("New Reset OTP sent successfully");
        return res.status(200).json("New Reset OTP sent successfully");
        
    } catch (error) {
        
    }
}

export const resetPassword = async (req, res) => {
    //1. Create hashed password
    //2. Assign to user
    //3. set passwordIsValidated to 0

    //Password Recovery Email is sent containing OTP
    //User enters OTP
    //Resets Password

    try {
        const user = await User.findOne({email: req.body.email})
        if(!user) return res.status(404).json("User not found 🙅‍♂️")

        //Get id of user
        const id = await user.id;
        //console.log(id);
        //res.status(200).json(id);
        //Encrypt Password
        const salt = bcrypt.genSaltSync(12);
        const hash = bcrypt.hashSync(req.body.resetPassword, salt);

        const updated = await User.findByIdAndUpdate(id, { password: hash}, {new:true}) 
        //const updated = await User.findByIdAndUpdate(req.params.id, { $set: req.body}, {new:true}) 
        //res.status(200).json(updated)
        console.log("New Password generated", updated)
        return res.status(200).json(updated);

        
    } catch (error) {
        console.log(error)
    }
}

export const sendLoginEmailOtp = async(emailParams, otpParams) => {

    const { OTP_EMAIL, OTP_PASSWORD } = process.env;
    
    let transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        // service: "gmail",
       auth: {
        user: OTP_EMAIL,
        pass: OTP_PASSWORD,
       }
    });


    try {   
        //test transporter
        transporter.verify((error, success) => {
            if(error){
                console.log("Transporter Error", error)
            } else {
                console.log(success)
            }
        });

        const mailOptions = {
            // from: OTP_EMAIL,
            from: `Sapphire ${OTP_EMAIL}`,
            to: emailParams,
            subject: "Sapphire Login Verification 🔒",
            html:   `<div style="width: 100%">
                    </div>
                    <p>Your verification code</p>
                    <p style="color: #0C4CAC; font-size: 24px"><b>${otpParams}</b></p>
                    <p>The verification code will be valid for <b>10 minutes</b>. Please do not share this code with anyone.</p>
                    <em>This is an automated message, please do not reply.</em>
                    `
        }
        await transporter.sendMail(mailOptions), (err, info) => {
            if (err) {
                console.log(err);
                return;
            }
        };
        // res.json({
        //     status: "Pending",
        //     message: "Verification OTP Email Sent",
        //     data: {
        //         email,
        //     },
        // })
        // return;
    } catch (error) {
        console.log(error)
            // res.json({
            //     status: "FAILED",
            //     message: error.message,
            // })
        // throw error;
    }

}


export const sendPasswordResetOtp = async(emailParams, otpParams) => {

    const { OTP_EMAIL, OTP_PASSWORD } = process.env;
    
    let transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        // service: "gmail",
       auth: {
        user: OTP_EMAIL,
        pass: OTP_PASSWORD,
       }
    });


    try {   
        //test transporter
        transporter.verify((error, success) => {
            if(error){
                console.log("Transporter Error", error)
            } else {
                console.log(success)
            }
        });

        const mailOptions = {
            // from: OTP_EMAIL,
            from: `Sapphire ${OTP_EMAIL}`,
            to: emailParams,
            subject: "Sapphire Password Reset Verification 🔒",
            html:   `<div style="width: 100%">
                    </div>
                    <p>Your verification code</p>
                    <p style="color: #0C4CAC; font-size: 24px"><b>${otpParams}</b></p>
                    <p>The verification code will be valid for <b>10 minutes</b>. Please do not share this code with anyone.</p>
                    <em>This is an automated message, please do not reply.</em>
                    `
        }
        await transporter.sendMail(mailOptions), (err, info) => {
            if (err) {
                console.log(err);
                return;
            }
        };
        // res.json({
        //     status: "Pending",
        //     message: "Verification OTP Email Sent",
        //     data: {
        //         email,
        //     },
        // })
        // return;
    } catch (error) {
        console.log(error)
            // res.json({
            //     status: "FAILED",
            //     message: error.message,
            // })
        // throw error;
    }

}