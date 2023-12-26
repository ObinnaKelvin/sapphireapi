import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import patientsRoute from '../routes/patient.js'
import appointmentsRoute from '../routes/appointment.js'
import referraltypesRoute from '../routes/referraltypes.js'
import statusRoute from '../routes/status.js'
import payerCategoryRoute from '../routes/payercategory.js'
import payerRoute from '../routes/payer.js'
import cors from 'cors';
import authRoute from '../routes/auth.js'
import userRoute from '../routes/user.js'
import tariffRoute from '../routes/tariff.js'


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


const PORT = process.env.PORT || 9000;

app.listen(PORT, ()=> {
    connect()
    console.log(`🚀 Server listening on port: ${PORT} 🚀`)
})