import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import patientsRoute from '../routes/patient.js'
import appointmentsRoute from '../routes/appointment.js'
import referraltypesRoute from '../routes/referraltypes.js'
import statusRoute from '../routes/status.js'
import payerCategoryRoute from '../routes/payerCategory.js'
import payerRoute from '../routes/payer.js'
import cors from 'cors';
import authRoute from '../routes/auth.js'
import userRoute from '../routes/user.js'
import tariffRoute from '../routes/tariff.js'
import serviceRoute from '../routes/service.js'
import { Server } from "socket.io";


const app = express();
dotenv.config();
mongoose.set('strictQuery', false);

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log(`🕹️ Connected to Sapphire Database!! 🕹️`)
        
    } catch (error) {
        throw(error)
    }
}

const corsOptions ={
    origin:'*', 
    // origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }

 //Add Cors before the routers 
app.use(cors(corsOptions));

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false}))
app.use("/api/patients", patientsRoute);
app.use("/api/appointments", appointmentsRoute);
app.use("/api/referraltypes", referraltypesRoute);
app.use("/api/payerCategory", payerCategoryRoute);
app.use("/api/payer", payerRoute);
app.use("/api/status", statusRoute);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/tariff", tariffRoute);
app.use("/api/service", serviceRoute);

//Socket Setup
const io = new Server({
    cors: {
        origin: "http://localhost:3000"
    }
 });

 
io.on("connection", (socket) => {
    console.log("Someone has just connected")

    socket.on("sendNotification", ({patientName, bookindDate, service}) => {
        io.emit("getNotification", {
            patientName, bookindDate, service
        })
    })

    socket.on("disconnect", () => {
        console.log("Someone has left");
    })
});




const PORT = process.env.PORT || 9000;
const SOCKETPORT = 9001;

app.listen(PORT, ()=> {
    connect()
    console.log(`🚀 Server listening on port: ${PORT} 🚀`)
})


 io.listen(SOCKETPORT, ()=> {
    console.log(`🔌 Socket Server listening on port: ${SOCKETPORT} 🔌`)
})