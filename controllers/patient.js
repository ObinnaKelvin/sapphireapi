import Patient from "../models/Patient.js";


//CREATE

export const createPatient = async (req, res) => {

    const newPatient = new Patient(req.body)

    try {
        const savedPatient = await newPatient.save();
        res.status(200).json(savedPatient)
        console.log(`New Patient "${savedPatient.firstName}" has now been created! 🙎`)
        
    } catch (error) {
        res.status(400).json(error);
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