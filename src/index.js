import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import patientsRoute from '../routes/patient.js'
import cors from 'cors';

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
app.use("/api/patients", patientsRoute)


const PORT = process.env.PORT || 9000;

app.listen(PORT, ()=> {
    connect()
    console.log(`🚀 Server listening on port: ${PORT} 🚀`)
})