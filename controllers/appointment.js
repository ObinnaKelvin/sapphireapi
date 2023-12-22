import Appointment from "../models/Appointment.js";


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

        const newAppointment = new Appointment({
        
            appointmentId: newItemid,
            patientId: req.body.patientId,
            patientNo: req.body.patientNo,
            staffId: req.body.staffId,
            visitId: req.body.visitId,
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
            age: req.body.age,
            gender: req.body.gender,
            mobile: req.body.mobile,
            email: req.body.email,
            referralTypeId: req.body.referralTypeId,
            referToDoctor: req.body.referToDoctor,
            authorizationNo: req.body.authorizationNo,
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

        const savedAppointment = await newAppointment.save();
        res.status(200).json(savedAppointment)
        console.log(`New Appointment for "${savedAppointment.firstName}" has now been created! 🙎`)
        
    } catch (error) {
        res.status(400).json(error);
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

//READ ALL

export const readAppointments = async(req, res) => {
    try {
        const appointments = await Appointment.find(req._id).sort({createdAt:-1})
        res.status(200).json(appointments)
    } catch (error) {
        res.status(400).json({message: "Cannot find Patients"});
    }
}