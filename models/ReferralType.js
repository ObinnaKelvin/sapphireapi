import mongoose from "mongoose";

const { Schema, model } = mongoose;


const ReferralTypeSchema = new Schema ({
    referralTypeId: {
        type: Number
    },
    referralTypeName: {
        type: String,
        //required: true
        required: "Please enter name of referral type"
    },
    active: {
        type: Number,
        default: 1
    },
}, {timestamps: true})

export default model("ReferralType", ReferralTypeSchema)