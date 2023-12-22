import Status from "../models/Status.js";


//CREATE

export const createStatus = async (req, res) => {

    //const newReferralType = new ReferralType(req.body)

    try {
        //1.Check if any exists
        //2. If exist set the new id
        //3. Else if not exist, set newid =1
        let newItemid;
        const isExistLastItem = await Status.find()//1.Check if any user exists
        if(isExistLastItem[0] === undefined) {
            newItemid = 1; //3. Else if not exist, set newuserid =1
        }
        else {
            const lastItemId = await Status.find({}, {statusId: 1, _id:0}).sort({_id:-1}).limit(1)
            newItemid = lastItemId[0].statusId + 1;  //2. If exist set the newItem id
        }

        
        const newStatus = new Status({
            statusId: newItemid,
            statusName: req.body.statusName,
            description: req.body.description,
            category: req.body.category,
            color: req.body.color,
            backgroundColor: req.body.backgroundColor,
            active: req.body.active
        })

        const savedStatus = await newStatus.save();
        res.status(200).json(savedStatus)
        console.log(`New "${savedStatus.statusName}" has now been created! 🙎`)
        
    } catch (error) {
        res.status(400).json(error);
    }
}