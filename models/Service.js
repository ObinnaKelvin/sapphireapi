import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ServiceSchema = new Schema ({
    serviceId: {
        type: Number
    },
    serviceName: {
        type: String,
        required: true
    },
    code: {
        type: String
    },
    standardPrice: {
        type: Number
    },
    active: {
        type: Number
    },
    encodedBy: {
        type: Number
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
    
}, {timestamps: true})

export default model("Service", ServiceSchema)