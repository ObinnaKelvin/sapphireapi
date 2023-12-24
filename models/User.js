import mongoose from "mongoose"

const { Schema, model } = mongoose;

const UserSchema = new Schema({
    user_id: {
        type: Number
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
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
        type: String,
        default: "patient"
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