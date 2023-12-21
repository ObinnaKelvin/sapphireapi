import Appointment from "../models/Appointment.js";


//CREATE

export const createAppointment = async (req, res) => {

    const newAppointment = new Appointment(req.body)

    try {
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