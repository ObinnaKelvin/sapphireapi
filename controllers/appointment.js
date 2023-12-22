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
        
            appointmentId: {
                type: Number
            },
            patientId: {
                type: Number
            },
            patientNo: {
                type: Number
            },
            staffId: {
                type: Number
            },
            visitId: {
                type: Number
            },
            firstName: {
                type: String,
                required: true
            },
            middleName: {
                type: String,
                required: true
            },
            lastName: {
                type: String,
                required: true
            },
            dateOfBirth: {
                type: Date,
                required: true
            },
            age: {
                type: Date,
                required: true
            },
            gender: {
                type: String,
                required: true
            },
            mobile: {
                type: Number,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            referralTypeId: {
                type: Number,
                default: null
            },
            referToDoctor: {
                type: Number,
                default: null
            },
            authorizationNo: {
                type: Number,
                default: null
            },
            appointmentStatus: {
                type: Number
            },
            paymentStatus: {
                type: Number
            },
            active: {
                type: Number
            },
            encodedBy: {
                type: Number,
                required: true
            },
            encodedDate: {
                type: Date,
                required: true
            },
            lastUpdatedBy: {
                type: Number,
                required: true
            },
            lastUpdatedDate: {
                type: Date,
                required: true
            },
            cancelReason: {
                type: String
            },
            invoiceId: {
                type: Number,
                default: null
            },
            payerId: {
                type: Number,
                required: true
            },
            payerCategoryId: {
                type: Number,
                required: true
            },
            checkInBy: {
                type: Number,
                required: true
            },
            checkInDate: {
                type: Date,
                required: true
            },

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
        const appointments = await Patient.find(req._id).sort({createdAt:-1})
        res.status(200).json(patients)
    } catch (error) {
        res.status(400).json({message: "Cannot find Patients"});
    }
}