import Tariff from "../models/Tariff.js";

//CREATE

export const createTariff = async (req, res) => {
    //1.Check if any exists
    //2. If exist set the new id
    //3. Else if not exist, set newid =1
    let newItemid;
    const isExistLastItem = await Tariff.find()//1.Check if any user exists
    if(isExistLastItem[0] === undefined) {
        newItemid = 1; //3. Else if not exist, set newuserid =1
    }
    else {
        const lastItemId = await Tariff.find({}, {tariffId: 1, _id:0}).sort({_id:-1}).limit(1)
        newItemid = lastItemId[0].tariffId + 1;  //2. If exist set the newItem id
    }

    const newTariff = new Tariff({
        tariffId: newItemid,
        tariffName: req.body.tariffName,
        serviceId: req.body.serviceId,
        payerId: req.body.payerId,
        cost: req.body.cost,
        active: req.body.active,
        encodedBy: req.body.encodedBy,
        encodedDate: req.body.encodedDate,
        lastUpdatedBy: req.body.lastUpdatedBy,
        lastUpdatedDate: req.body.lastUpdatedDate,
    })

    await newTariff.save()
    res.status(200).json(newTariff)

}

//READ

export const readTariff = async (req, res) => {
    try {
        const tariff = await Tariff.findOne({serviceId: req.params.id})
        //const tariff = await Tariff.findById(req.params.id)
        res.status(200).json(tariff)
    } catch (error) {
        res.status(400).json(error);
    }
}

//READ ALL

export const readTariffs = async(req, res) => {
    try {
        const tariffs = await Tariff.find(req._id).sort({createdAt:-1})
        res.status(200).json(tariffs)
    } catch (error) {
        res.status(400).json({message: "Cannot find tariffs"});
    }
}