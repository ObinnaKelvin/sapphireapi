import Patient from "../models/Patient.js";
import User from "../models/User.js";
import fs from 'fs';
import xlsx from 'xlsx'
import os from 'os'
import path from 'path'

//CREATE

export const exportAllPatientReport = async (req, res) => {
    try {
        await Patient.find({}).then(result => {
            
            if(result.length > 0) {

                //Use node to target download Path.
                const homeDir = os.homedir()
                const downloadPath = path.join(homeDir, 'Download')
                const downloadsPath = path.join(homeDir, 'Downloads')

                //Create New Workbook
                let workbook = xlsx.utils.book_new();

                //Convert JSON Array to Worksheet
                let worksheet = xlsx.utils.json_to_sheet(result);

                //Append a Worksheet To Workbook
                xlsx.utils.book_append_sheet(workbook, worksheet, "AllPatients")

                //Attempts to write to file into Download Path of current user (Check if "Downloads" folder exists else save file in "Download" folder)
                downloadsPath ? xlsx.writeFile(workbook, downloadsPath) : xlsx.writeFile(workbook, downloadPath)
                // xlsx.writeFile(workbook, downloadPath)

                console.log("Success")


            } else {
                res.send(console.log("No Data Available"))
            }
        })
        // let reader = fs.createReadStream
        
    } catch (error) {
        
    }

}