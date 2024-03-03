import Notifications from "../models/Notifications.js";
import NotificationsByUser from "../models/NotificationsByUser.js";
import User from "../models/User.js"
import otpGenerator from 'otp-generator';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer'


//CREATE

export const createNotification = async (req, res) => {


    try {
        //1. Check if any exists
        //2. If exist set the new id
        //3. Else if not exist, set newid =1

        let newItemid;
        const isExistLastItem = await Notifications.find()//1.Check if any user exists
        if(isExistLastItem[0] === undefined) {
            newItemid = 1; //3. Else if not exist, set newuserid =1
        }
        else {
            const lastItemId = await Notifications.find({}, {notificationId: 1, _id:0}).sort({_id:-1}).limit(1)
            newItemid = lastItemId[0].notificationId + 1;  //2. If exist set the newItem id
        }

        const newNotification = new Notifications({
            notificationId: newItemid,
            title: req.body.title,
            body: req.body.body,
            type: req.body.type,
            destination: req.body.destination,
            encodedDate: req.body.encodedDate,
            lastUpdatedDate: req.body.lastUpdatedDate
        })

        
        await newNotification.save()
        res.status(200).json(newNotification)
        console.log(`New Notification has now been created!🙋‍♂️`)

        
        //CREATE NOTIFICATION PER CURRENT USERS

        //1.Stack all existing users id in an array
        const allUsersId = await User.find({role: {$ne:"patient"}}, {user_id: 1, _id: 0}) //Finds any user whose role is not qual to patient and then return the user-id column without the _id returned by default
        console.log(allUsersId)


        //2. For each user, map the new notification Id to the NotificationByUser Schema
        allUsersId.forEach((userid) => {

            const newNotificationByUser = new NotificationsByUser({
                notificationId: newItemid,
                userId: userid.user_id,
                status: req.body.status,
                priority: req.body.priority,
                encodedDate: req.body.encodedDate,
                lastUpdatedDate: req.body.lastUpdatedDate
            })

            newNotificationByUser.save();
            console.log(newNotificationByUser)

        })


    } catch (error) {
        console.log(error)
        //res.status(400).json(error);
    }
}


//READ

export const readNotification = async (req, res) => {
    try {
        // const patient = await Patient.findById(req.params.id)
        const patient = await Notifications.find({email: req.params.id})
        res.status(200).json(patient)
    } catch (error) {
        res.status(400).json(error);
    }
}

//READ ALL

export const readNotifications = async(req, res) => {
    try {
        const notifications = await Notifications.find(req._id).sort({createdAt:-1})
        res.status(200).json(notifications)
    } catch (error) {
        res.status(400).json({message: "Cannot find notifications"});
    }
}


//UPDATE

export const updateNotification = async(req, res) => {
    try {
        const updated = await Notifications.findByIdAndUpdate(req.params.id, { $set: req.body}, {new:true})
        res.status(200).json(updated)
        console.log(`Patient "${updated.firstName}" has now been updated! 🐞`)
    } catch (error) {
        res.status(400).json({message: "cannot update Patient"});
    }
}

//DELETE

export const deleteNotification = async(req, res) => {
    try {       
        await Notifications.findByIdAndDelete(req.params.id)
        res.status(200).json("Patient has been deleted")
    } catch (error) {
        res.status(400).json({message: "Notification cannot be deleted"});
    }

}




export const sendAccountCreationEmail = async(emailParams, firstnameParams, passwordParams) => {

    const { OTP_EMAIL, OTP_PASSWORD } = process.env;
    
    let transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
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
                    <br/>
                    <p>Thanks,
                    The Sapphire Team.
                    </p>
                    <br/><br/>
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