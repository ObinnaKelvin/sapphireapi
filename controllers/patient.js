import Patient from "../models/Patient.js";
import User from "../models/User.js";
import otpGenerator from 'otp-generator';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer'


//CREATE

export const createPatient = async (req, res) => {

    //const newPatient = new Patient(req.body)

    try {
        //1. Check if any exists
        //2. If exist set the new id
        //3. Else if not exist, set newid =1
        let newItemid;
        const isExistLastItem = await Patient.find()//1.Check if any user exists
        if(isExistLastItem[0] === undefined) {
            newItemid = 1; //3. Else if not exist, set newuserid =1
        }
        else {
            const lastItemId = await Patient.find({}, {patientId: 1, _id:0}).sort({_id:-1}).limit(1)
            newItemid = lastItemId[0].patientId + 1;  //2. If exist set the newItem id
        }

        //Patient Registration number
        let newPatientNo;
        const isExistPatient = await Patient.find()//1.Check if any user exists
        if(isExistPatient[0] === undefined) {
            newPatientNo = 1011000000; //3. Else if not exist, set newuserid =1
        }
        else {
            const lastPatientNo = await Patient.find({}, {patientNo: 1, _id:0}).sort({_id:-1}).limit(1)
            newPatientNo = lastPatientNo[0].patientNo + 1;  //2. If exist set the newItem id
        }


        const newPatient = new Patient({
            patientId: newItemid,
            patientNo: newPatientNo,
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            mobile: req.body.mobile,
            email: req.body.email,
            gender: req.body.gender,
            dateOfBirth: req.body.dateOfBirth,
            maritalStatus: req.body.maritalStatus,
            address: req.body.address,
            state: req.body.state,
            country: req.body.country,
            kinName: req.body.kinName,
            kinPhone: req.body.kinPhone,
            kinRelationship: req.body.kinRelationship,
            kinAddress: req.body.kinAddress,
            emergencyName: req.body.emergencyName,
            emergencyPhone: req.body.emergencyPhone,
            emergencyRelationship: req.body.emergencyRelationship,
            emergencyAddress: req.body.emergencyAddress,
            isFullyRegistered: req.body.isFullyRegistered,
            payerId: req.body.payerId,
            active: req.body.active,
            encodedBy: req.body.encodedBy,
            encodedDate: req.body.encodedDate,
            lastUpdatedBy: req.body.lastUpdatedBy,
            lastUpdatedDate: req.body.lastUpdatedDate
        })

        
        const isExistPatientDB = await Patient.findOne({email: req.body.email})
        if(isExistPatientDB) return res.status(404).json("Patient already exists 🙅‍♂️")
        await newPatient.save()
        res.status(200).json(newPatient)
        console.log(`New Patient "${newPatient.firstName}" has now been created!🙋‍♂️`)

        
        //CREATE USER LOGIN DETAILS LOGIC

        //1.Check if any user exists
        const isExist = await User.findOne({email: req.body.email})
        if(isExist) {
            console.log("User already exists 🙅‍♂️")
            //return res.status(404).json("User already exists 🙅‍♂️")
        } else {
            //2. If doesn't exist set the newuser id
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
    
            //4.Generate Random Password using otpGenerator
            const RandomPasswordGen = otpGenerator.generate(6, {
                digits: true, alphabets: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: true
            });
            console.log(RandomPasswordGen);
            const salt = bcrypt.genSaltSync(12);
            const hash = bcrypt.hashSync(RandomPasswordGen, salt);
    
            const newUser = new User({
                user_id: newUserid,
                firstname: req.body.firstName,
                lastname: req.body.lastName,
                //username: req.body.username,
                email: req.body.email,
                password: hash,
                gender: req.body.gender,
                phone: req.body.mobile,
                //role:req.body.role
            })
            
            await newUser.save()
            //console.log(newUser)
            //res.status(200).json(newUser)
            .then((output) => {
                //console.log(output)
                //const { email, firstname  } = output
                sendAccountCreationEmail(output.email, output.firstname, RandomPasswordGen)
            })
            console.log(`User "${newUser.firstname}" has now been created!🙋‍♂️`)

        }


    } catch (error) {
        console.log(error)
        //res.status(400).json(error);
    }
}


//READ

export const readPatient = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id)
        res.status(200).json(patient)
    } catch (error) {
        res.status(400).json(error);
    }
}

//READ ALL

export const readPatients = async(req, res) => {
    try {
        const patients = await Patient.find(req._id).sort({createdAt:-1})
        res.status(200).json(patients)
    } catch (error) {
        res.status(400).json({message: "Cannot find Patients"});
    }
}


//UPDATE

export const updatePatient = async(req, res) => {
    try {
        const updated = await Patient.findByIdAndUpdate(req.params.id, { $set: req.body}, {new:true})
        res.status(200).json(updated)
        console.log(`Incidence "${updated.incidence}" has now been updated! 🐞`)
    } catch (error) {
        res.status(400).json({message: "cannot update Patient"});
    }
}

//DELETE

export const deletePatient = async(req, res) => {
    try {       
        await Patient.findByIdAndDelete(req.params.id)
        res.status(200).json("Patient has been deleted")
    } catch (error) {
        res.status(400).json({message: "Patient cannot be deleted"});
    }

}




export const sendAccountCreationEmail = async(emailParams, firstnameParams, passwordParams) => {

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
            subject: "Welcome On Board! 🔒",
            html:   `<div style="width: 100%">
                    </div>
                    <p>Hi <span style="color: #0C4CAC; font-size: 22px"><b>${firstnameParams}</b></span>,</p>
                    <p>You have now been registered as one of our esteemed customers, and your patient portal account is ready to use.</p>
                    
                    <p>Patient Portal Login Credentials:</p>
                    <span>Email: <b>${emailParams}</b></span><br/>
                    <span>Password: <b>${passwordParams}</b></span><br/>
                    <br/>
                    <em>We advice that you change your password immediately.</em><br/><br/>
                    <div style="width: 100%; display: flex; align-items: center; margin: 0px auto 0px auto;">
                        <a href="https://sapphire-partners.com">
                            <div style="width: 100px; background-color: #0C4CAC; color: #ffffff; padding:10px; text-align:center; margin: 0px auto 0px auto; cursor: pointer">Login</div>
                        </a>
                    </div>
                    <br/><br/><br/>
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