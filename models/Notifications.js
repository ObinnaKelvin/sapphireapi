import mongoose from "mongoose";

const { Schema, model } = mongoose;

const NotificationsSchema = new Schema ({

    notificationId: {
        type: Number
    },
    title: {
        type: String
    },
    body: {
        type: String
    },
    type: {
        type: String,
        default: "alert",
        default: null
    },
    destination: {
        type: String,
        default: "staff"
    },
    encodedDate: {
        type: Date,
        required: true
    },
    lastUpdatedDate: {
        type: Date,
        //required: true
    }

}, {timestamps: true})

export default model("Notifications", NotificationsSchema)