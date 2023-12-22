import ReferralType from "../models/ReferralType.js";


//CREATE

export const createReferralType = async (req, res) => {

    //const newReferralType = new ReferralType(req.body)

    try {
        //1.Check if any exists
        //2. If exist set the new id
        //3. Else if not exist, set newid =1
        let newItemid;
        const isExistLastItem = await ReferralType.find()//1.Check if any user exists
        if(isExistLastItem[0] === undefined) {
            newItemid = 1; //3. Else if not exist, set newuserid =1
        }
        else {
            const lastItemId = await ReferralType.find({}, {referralTypeId: 1, _id:0}).sort({_id:-1}).limit(1)
            newItemid = lastItemId[0].referralTypeId + 1;  //2. If exist set the newItem id
        }

        
        const newReferralType = new ReferralType({
            referralTypeId: newItemid,
            referralTypeName: req.body.name,
            active: req.body.active
        })

        const savedReferralType = await newReferralType.save();
        res.status(200).json(savedReferralType)
        console.log(`New "${savedReferralType.referralTypeName}" has now been created! 🙎`)
        
    } catch (error) {
        res.status(400).json(error);
    }
}