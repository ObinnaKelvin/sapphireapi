import Patient from "../models/Patient.js";
import otpGenerator from 'otp-generator';


//CREATE

export const createPatient = async (req, res) => {

    //const newPatient = new Patient(req.body)

    try {
        //1.Check if any exists
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
            return res.status(404).json("User already exists 🙅‍♂️")
        }

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
            digits: true, alphabets: true, lowerCaseAlphabets: false, upperCaseAlphabets: true, specialChars: true
        });
        console.log(RandomPasswordGen);
        const salt = bcrypt.genSaltSync(12);
        const hash = bcrypt.hashSync(RandomPasswordGen, salt);

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

        //const isExist = await User.findOne({email: req.body.email})
        //if(isExist) return res.status(404).json("User already exists 🙅‍♂️")
        await newUser.save()
        res.status(200).json(newUser)
        console.log(`User "${newUser.firstname}" has now been created!🙋‍♂️`)


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