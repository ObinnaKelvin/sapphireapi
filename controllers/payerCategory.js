import PayerCategory from "../models/PayerCategory.js";


//CREATE

export const createPayerCategory = async (req, res) => {

    //const newReferralType = new ReferralType(req.body)

    try {
        //1.Check if any exists
        //2. If exist set the new id
        //3. Else if not exist, set newid =1
        let newItemid;
        const isExistLastItem = await PayerCategory.find()//1.Check if any user exists
        if(isExistLastItem[0] === undefined) {
            newItemid = 1; //3. Else if not exist, set newuserid =1
        }
        else {
            const lastItemId = await PayerCategory.find({}, {payerCategoryId: 1, _id:0}).sort({_id:-1}).limit(1)
            newItemid = lastItemId[0].payerCategoryId + 1;  //2. If exist set the newItem id
        }

        
        const newPayerCategory = new PayerCategory({
            payerCategoryId: newItemid,
            payerCategoryName: req.body.name,
            active: req.body.active
        })

        const savedPayerCategory = await newPayerCategory.save();
        res.status(200).json(savedPayerCategory)
        console.log(`New "${savedPayerCategory.payerCategoryName}" has now been created! 🙎`)
        
    } catch (error) {
        res.status(400).json(error);
    }
}