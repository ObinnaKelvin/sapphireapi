import Notifications from "../models/Notifications.js";
import NotificationsByUser from "../models/NotificationsByUser.js";

//CREATE

export const createNotificationsByUser = async (req, res) => {


    try {
        //1. Check if any exists
        //2. If exist set the new id
        //3. Else if not exist, set newid =1

        let newItemid;
        const isExistLastItem = await NotificationsByUser.find()//1.Check if any user exists
        if(isExistLastItem[0] === undefined) {
            newItemid = 1; //3. Else if not exist, set newuserid =1
        }
        else {
            const lastItemId = await NotificationsByUser.find({}, {notificationByUserId: 1, _id:0}).sort({_id:-1}).limit(1)
            newItemid = lastItemId[0].notificationByUserId + 1;  //2. If exist set the newItem id
        }

        const newNotificationByUser = new NotificationsByUser({
            notificationByUserId: newItemid,
            notificationId: req.body.notificationId,
            userId: req.body.userId,
            status: req.body.status,
            priority: req.body.priority,
            encodedDate: req.body.encodedDate,
            lastUpdatedDate: req.body.lastUpdatedDate
        })

        
        await newNotificationByUser.save()
        res.status(200).json(newNotificationByUser)
        console.log(`New NotificationByUser has now been created!🙋‍♂️`)


    } catch (error) {
        console.log(error)
        //res.status(400).json(error);
    }
}