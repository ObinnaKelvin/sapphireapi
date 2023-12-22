import Payer from "../models/Payer.js";


//CREATE

export const createPayer = async (req, res) => {

    //const newReferralType = new ReferralType(req.body)

    try {
        //1.Check if any exists
        //2. If exist set the new id
        //3. Else if not exist, set newid =1
        let newItemid;
        const isExistLastItem = await Payer.find()//1.Check if any user exists
        if(isExistLastItem[0] === undefined) {
            newItemid = 1; //3. Else if not exist, set newuserid =1
        }
        else {
            const lastItemId = await Payer.find({}, {payerId: 1, _id:0}).sort({_id:-1}).limit(1)
            newItemid = lastItemId[0].payerId + 1;  //2. If exist set the newItem id
        }

        
        const newPayer = new Payer({
            payerId: newItemid,
            payerName: req.body.name,
            payerCategoryId: req.body.category,
            encodedBy: req.body.encodedBy,
            encodedDate: req.body.encodedDate,
            lastUpdatedBy: req.body.lastUpdatedBy,
            lastUpdatedDate: req.body.lastUpdatedDate,
            active: req.body.active
        })

        const savedPayer = await newPayer.save();
        res.status(200).json(savedPayer)
        console.log(`New "${savedPayer.payerName}" has now been created! 🙎`)
        
    } catch (error) {
        res.status(400).json(error);
    }
}