import mongoose from "mongoose"

const { Schema, model } = mongoose;

const OTPSchema = new Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: Number
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {type: Date, default: Date.now, index: { expires: 600}}

    //After 5 minutes it deleted automatically from the database

}, {timestamps: true})

export default model("OTP", OTPSchema)