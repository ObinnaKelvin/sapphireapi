import mongoose from "mongoose"

const { Schema, model } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String
    },
    otp: {
        type: String,
        required: true,
    },
    gender: {
        type: String
    },
    phone: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    role:{
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isReadNotification: {
        type: Boolean,
        default: false
    }

}, {timestamps: true})

export default model("User", UserSchema)