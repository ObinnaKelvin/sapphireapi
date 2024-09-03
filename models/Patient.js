import mongoose from "mongoose";

const { Schema, model } = mongoose;

const PatientSchema = new Schema ({
    patientId: {
        type: Number
    },
    patientNo: {
        type: Number
    },
    title: {
        type: String,
    },
    firstName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
        //required: true
    },
    lastName: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    dateOfBirth: {
        // type: Date,
        type: String,
        //required: true
    },
    // age: {
    //     type: Number,
    //     default: 20
    // },
    maritalStatus: {
        type: String,
        //required: true
    },
    religion: {
        type: String,
        //required: true
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
    },
    kinName: {
        type: String,
    },
    kinPhone: {
        type: String,
    },
    kinRelationship: {
        type: String,
    },
    kinAddress: {
        type: String,
    },
    emergencyName: {
        type: String,
    },
    emergencyPhone: {
        type: String,
    },
    emergencyRelationship: {
        type: String,
    },
    emergencyAddress: {
        type: String,
    },
    isFullyRegistered: {
        type: Number,
        default: 0,
    },
    payerId: {
        type: Number,
        default: 1,
        required: true
    },
    active: {
        type: Number,
        default: 1,
    },
    emr_maidenname: {
        type: String,
    },
    emr_gender: {
        type: String,
    },
    emr_tel: {
        type: String,
    },
    emr_birthplace: {
        type: String,
    },
    emr_occupation: {
        type: String,
    },
    emr_workplace: {
        type: String,
    },
    emr_kinOccupation: {
        type: String,
    },
    emr_stateCode: {
        type: String,
    },
    emr_nationalityId: {
        type: String,
    },
    emr_religionId: {
        type: String,
    },
    encodedBy: {
        type: String,
    },
    encodedDate: {
        type: Date,
    },
    lastUpdatedBy: {
        type: Number,
    },
    lastUpdatedDate: {
        type: Date,
    }
}, {timestamps: true})


//Virtual property to calculate age dynamically
PatientSchema.virtual('age').get(function() {
    const today = new Date();
    const birthdate = this.dateOfBirth;
    const age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() = birthdate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
        return age - 1;
    }

    return age;
})

export default model("Patient", PatientSchema)