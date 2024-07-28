import Service from "../models/Service.js";

//CREATE

export const createService = async (req, res) => {
    //1.Check if any exists
    //2. If exist set the new id
    //3. Else if not exist, set newid =1
    let newItemid;
    const isExistLastItem = await Service.find()//1.Check if any user exists
    if(isExistLastItem[0] === undefined) {
        newItemid = 1; //3. Else if not exist, set newuserid =1
    }
    else {
        const lastItemId = await Service.find({}, {serviceId: 1, _id:0}).sort({_id:-1}).limit(1)
        newItemid = lastItemId[0].serviceId + 1;  //2. If exist set the newItem id
    }

    const newService = new Service({
        serviceId: newItemid,
        serviceName: req.body.serviceName,
        code: req.body.code,
        standardPrice: req.body.standardPrice,
        active: req.body.active,
        encodedBy: req.body.encodedBy,
        encodedDate: req.body.encodedDate,
        lastUpdatedBy: req.body.lastUpdatedBy,
        lastUpdatedDate: req.body.lastUpdatedDate,
    })

    await newService.save()
    res.status(200).json(newService)

}

//READ

export const readService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id)
        res.status(200).json(service)
    } catch (error) {
        res.status(400).json(error);
    }
}

//READ ALL

export const readServices = async(req, res) => {
    try {
        // const service = await Service.find(req._id).sort({createdAt:-1})
        const service = await Service.find({active: 1, serviceId: {$ne: 10}}).sort({createdAt:-1})
        res.status(200).json(service)
    } catch (error) {
        res.status(400).json({message: "Cannot find services"});
    }
}