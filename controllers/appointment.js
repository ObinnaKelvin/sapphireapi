import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import Patient from "../models/Patient.js";
import otpGenerator from 'otp-generator';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer'
import mg from 'nodemailer-mailgun-transport';
import { formatDate } from '../utils/formatDate.js'


//CREATE

export const createAppointment = async (req, res) => {

    //const newAppointment = new Appointment(req.body)

    try {

        //CREATE PATIENT
        //1. Check if any exists
        //2. If exist set the new id
        //3. Else if not exist, set newid =1
        let newItemidPat;
        const isExistLastItemPat = await Patient.find()//1.Check if any user exists
        if(isExistLastItemPat[0] === undefined) {
            newItemidPat = 1; //3. Else if not exist, set newuserid =1
        }
        else {
            const lastItemIdPat = await Patient.find({}, {patientId: 1, _id:0}).sort({_id:-1}).limit(1)
            newItemidPat = lastItemIdPat[0].patientId + 1;  //2. If exist set the newItem id
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
            patientId: newItemidPat,
            patientNo: newPatientNo,
            firstName: req.body.firstname,
            middleName: req.body.middlename,
            lastName: req.body.lastname,
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
        if(!isExistPatientDB) {
            await newPatient.save()
            console.log(`New Patient "${newPatient.firstName}" has now been created!🙋‍♂️`)
        }
        else {
            console.log(`Patient already exists 🙅‍♂️`)
        }


        //CREATE APPOINTMENT
        //1.Check if any exists
        //2. If exist set the new id
        //3. Else if not exist, set newid =1
        let newItemid;
        const isExistLastItem = await Appointment.find()//1.Check if any user exists
        if(isExistLastItem[0] === undefined) {
            newItemid = 1; //3. Else if not exist, set newuserid =1
        }
        else {
            const lastItemId = await Appointment.find({}, {appointmentId: 1, _id:0}).sort({_id:-1}).limit(1)
            newItemid = lastItemId[0].appointmentId + 1;  //2. If exist set the newItem id
        }

        //Find Patient No
        let isPatientNo;
        let isPatientId;
        const isPatientExist = await Patient.findOne({email: req.body.email, mobile: req.body.mobile})
        isPatientNo = isPatientExist.patientNo
        isPatientId = isPatientExist.patientId

        const newAppointment = new Appointment({
        
            appointmentId: newItemid,
            patientId: isPatientId,
            patientNo: isPatientNo,
            staffId: req.body.staffId,
            visitId: req.body.visitId,
            firstname: req.body.firstname,
            middlename: req.body.middlename,
            lastname: req.body.lastname,
            // dateOfBirth: req.body.dateOfBirth,
            // age: req.body.age,
            gender: req.body.gender,
            mobile: req.body.mobile,
            email: req.body.email,         
            notes: req.body.notes,
            service: req.body.service,
            tariff: req.body.totalbill,
            referralTypeId: req.body.referralTypeId,
            referToDoctor: req.body.referToDoctor,
            authorizationNo: req.body.authorizationNo,
            referenceNo: req.body.referenceNo,
            appointmentDate: req.body.appointmentDate,
            appointmentStatus: req.body.appointmentStatus,
            paymentStatus: req.body.paymentStatus,
            active: req.body.active,
            encodedBy: req.body.encodedBy,
            encodedDate: req.body.encodedDate,
            lastUpdatedBy: req.body.lastUpdatedBy,
            lastUpdatedDate: req.body.lastUpdatedDate,
            cancelReason: req.body.cancelReason,
            invoiceId: req.body.invoiceId,
            payerId: req.body.payerId,
            payerCategoryId: req.body.payerCategoryId,
            checkInBy: req.body.checkInBy,
            checkInDate: req.body.checkInDate

        })

        //const savedAppointment = await newAppointment.save();
        await newAppointment.save()
        .then((output) => {
            console.log(output)
            //sendAccountCreationEmail(output.email, output.firstname, RandomPasswordGen)
            sendAppointmentCreationEmail(output.email, output.firstname, output.lastname, output.appointmentDate, output.service, output.tariff, output.appointmentId, output.paymentStatus)
        })
        res.status(200).json(newAppointment)
        //res.status(200).json(savedAppointment)
        //console.log(`New Appointment for "${savedAppointment.firstName}" has now been created! 🙎`)


        
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
                firstname: req.body.firstname,
                lastname: req.body.lastname,
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
                sendAppointmentCreationEmail(output.email, output.firstname, output.lastname, output.appointmentDate, output.service, output.tariff, output.appointmentId)
            })
            console.log(`User "${newUser.firstname}" has now been created!🙋‍♂️`)

        }
        
    } catch (error) {
        console.log(error)
        //res.status(400).json(error);
    }
}

//READ

export const readAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
        res.status(200).json(appointment)
    } catch (error) {
        res.status(400).json(error);
    }
}

//READ BY EMAIL

export const readAppointmentByEmail = async (req, res) => {
    try {
        const appointment = await Appointment.find({email: req.params.id, active: 1}).sort({createdAt:-1})
        res.status(200).json(appointment)
    } catch (error) {
        res.status(400).json(error);
    }
}


//READ BY EMAIL, APPOINTMENT DATE >= TODAY

export const readAppointmentByEmailByAppointmentDateGTEToday = async (req, res) => {
    try {
        // const today = formatDate(new Date())
        const today = new Date().toLocaleDateString('sv-SE')
        //console.log(today)
        const appointment = await Appointment.find({email: req.params.id, appointmentDate: {$gte: today}, active: 1}).sort({appointmentDate:-1})
        //const appointment = await Appointment.find({appointmentDate: {$gte: today}}).sort({createdAt:-1})
       res.status(200).json(appointment)
    } catch (error) {
        res.status(400).json(error);
    }
}

//READ BY EMAIL, APPOINTMENT DATE < TODAY

export const readAppointmentByEmailByAppointmentDateLTToday = async (req, res) => {
    try {
        // const today = formatDate(new Date())
        const today = new Date().toLocaleDateString('sv-SE')
        //console.log(today)
        const appointment = await Appointment.find({email: req.params.id, appointmentDate: {$lt: today}, active: 1}).sort({appointmentDate:-1})
        //const appointment = await Appointment.find({appointmentDate: {$gte: today}}).sort({createdAt:-1})
       res.status(200).json(appointment)
    } catch (error) {
        res.status(400).json(error);
    }
}


//READ ALL

export const readAppointments = async(req, res) => {
    try {
        const appointments = await Appointment.find(req._id).sort({createdAt:-1})
        //const appointments = await Appointment.find(req._id).sort({appointmentDate:-1})
        res.status(200).json(appointments)
    } catch (error) {
        res.status(400).json({message: "Cannot find Patients"});
    }
}


//UPDATE

export const updateAppointment = async(req, res) => {
    try {
        const updated = await Appointment.findByIdAndUpdate(req.params.id, { $set: req.body}, {new:true})
        res.status(200).json(updated)
        console.log(`Appointment for "${updated.firstname}" has now been updated! 🐞`)
    } catch (error) {
        res.status(400).json({message: "cannot update Patient"});
    }
}



//EMAILS 

export const sendAccountCreationEmail = async(emailParams, firstnameParams, passwordParams) => {
    
    //OUTLOOK
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


    //MAILGUN

    // const { MAILGUN_DOMAIN, MAILGUN_FROM, MAILGUN_PASSWORD, MAILGUN_API_KEY } = process.env;
    
    // const auth = {
    //     auth: {
    //       api_key: MAILGUN_API_KEY,
    //       domain: MAILGUN_DOMAIN
    //     }
    // }  
    // let transporter = nodemailer.createTransport(mg(auth));




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
            from: OTP_EMAIL,
            // from: `Sapphire ${OTP_EMAIL}`,
            // from: `Sapphire ${MAILGUN_FROM}`,
            to: emailParams,
            subject: "Welcome On Board 🎉🎉",
            html:   `<div style="width: 100%">
                    </div>
                    <p><em>Hi <span style="color: #0C4CAC; font-size: 22px"><b>${firstnameParams}</b></span></em>,</p>
                    <p>You have now been registered as one of our esteemed customers, and your patient portal account is ready to use.</p>
                    
                    <p>Patient Portal Login Credentials:</p>
                    <span>Email: <b>${emailParams}</b></span><br/>
                    <span>Password: <b>${passwordParams}</b></span><br/>
                    <br/>
                    <em>We advice that you change your password immediately.</em><br/><br/>
                    <div style="width: 100%; display: flex; align-items: center; margin: 0px auto 0px auto;">
                        <a href="https://www.sapphiresurgeons.com">
                            <div style="width: 100px; background-color: #0C4CAC; color: #ffffff; padding:10px; text-align:center; margin: 0px auto 0px auto; cursor: pointer">Login</div>
                        </a>
                    </div>
                    <br/>
                    <p>Thanks,
                    <br/>
                    The Sapphire Team.
                    </p>
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

export const sendAppointmentCreationEmail = async(emailParams, firstnameParams, lastnameParams, dateParams, serviceParams, costParams, appointmentIdParams, statusParams) => {

    // OUTLOOK
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


    //MAILGUN

    // const { MAILGUN_DOMAIN, MAILGUN_FROM, MAILGUN_PASSWORD, MAILGUN_API_KEY } = process.env;
    
    // const auth = {
    //     auth: {
    //       api_key: MAILGUN_API_KEY,
    //       domain: MAILGUN_DOMAIN
    //     }
    // }    

    // let transporter = nodemailer.createTransport(mg(auth));


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
            from: OTP_EMAIL,
            // from: `Sapphire ${OTP_EMAIL}`,
            // from: `Sapphire ${MAILGUN_FROM}`,
            to: emailParams,
            subject: "Appointment Booked 📅",
            html:   `<div style="width: 100%; height: 30px; display: flex; align-items: center; justify-content:center;">
                        <img style="width: 20px; height: 20px; margin: 0px auto 0px auto" src="https://firebasestorage.googleapis.com/v0/b/sapphire-15128.appspot.com/o/pages%2Flogo.PNG?alt=media&token=f001869a-350c-4246-aeec-6ae23f4209bc" />
                    </div>
                    <p><em>Hi <span style="color: #0C4CAC; font-size: 22px"><b>${firstnameParams}</b></span></em>,</p>
                    <p>Your appointment has been booked successfully. Please find the details of your visit below.</p>
                    
                    <span><b>Appointment Details:</b></span><br/>
                    <span>Appointment ID: <b>#SAPP-${appointmentIdParams}</b></span><br/>
                    <span>Patient: <b>${firstnameParams} ${lastnameParams}</b></span><br/>
                    <span>Venue: <b>7B Oju Olobun Street, Victoria Island, Lagos.</b></span><br/>
                    <span>Date: <b>${dateParams}</b></span><br/>
                    <span>Service: <b>${serviceParams}</b></span><br/>
                    <span>Cost: <b>${costParams}</b></span><br/>
                    <span>Payment Status: <b>${statusParams}</b></span><br/>
                    <br/>
                    <p>Thanks,<br/>
                    The Sapphire Team.
                    </p>
                    
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