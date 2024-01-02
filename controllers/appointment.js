import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import Patient from "../models/Patient.js";
import otpGenerator from 'otp-generator';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer'


//CREATE

export const createAppointment = async (req, res) => {

    //const newAppointment = new Appointment(req.body)

    try {
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
            tariff: req.body.tariff,
            referralTypeId: req.body.referralTypeId,
            referToDoctor: req.body.referToDoctor,
            authorizationNo: req.body.authorizationNo,
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
            //console.log(output)
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
        const appointment = await Appointment.find({email: req.params.id})
        res.status(200).json(appointment)
    } catch (error) {
        res.status(400).json(error);
    }
}

//READ ALL

export const readAppointments = async(req, res) => {
    try {
        const appointments = await Appointment.find(req._id).sort({createdAt:-1})
        res.status(200).json(appointments)
    } catch (error) {
        res.status(400).json({message: "Cannot find Patients"});
    }
}


//EMAILS 

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
            subject: "Welcome On Board! 🎉🎉",
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
                        <a href="https://sapphire-partners.com">
                            <div style="width: 100px; background-color: #0C4CAC; color: #ffffff; padding:10px; text-align:center; margin: 0px auto 0px auto; cursor: pointer">Login</div>
                        </a>
                    </div>
                    <br/>
                    <p>Thanks,
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
            subject: "Appointment Booked! 📅",
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