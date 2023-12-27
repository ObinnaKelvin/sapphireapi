import mongoose from "mongoose";

const { Schema, model } = mongoose;

const AppointmentSchema = new Schema ({
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
        type: Number,
        default: null
    },
    visitId: {
        type: Number
    },
    firstname: {
        type: String,
        required: true
    },
    middlename: {
        type: String,
    },
    lastname: {
        type: String,
        required: true
    },
    // dateOfBirth: {
    //     type: Date,
    //     required: true
    // },
    // age: {
    //     type: Number,
    //     required: true
    // },
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
    notes: {
        type: String,
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
    service: {
        type: String,
    },
    tariff: {
        type: Number
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    appointmentStatus: {
        type: Number,
        default: 9
    },
    paymentStatus: {
        type: Number,
        default: 2
    },
    active: {
        type: Number,
        default: 1
    },
    encodedBy: {
        type: Number,
        //required: true
    },
    encodedDate: {
        type: Date,
        required: true
    },
    lastUpdatedBy: {
        type: Number,
        //required: true
    },
    lastUpdatedDate: {
        type: Date,
        //required: true
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
        default: 1,
        required: true
    },
    payerCategoryId: {
        type: Number,
        default: 1,
        required: true
    },
    checkInBy: {
        type: Number,
    },
    checkInDate: {
        type: Date,
    },
}, {timestamps: true})

export default model("Appointment", AppointmentSchema)