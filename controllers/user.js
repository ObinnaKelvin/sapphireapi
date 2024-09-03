import User from '../models/User.js';

//CREATE

//WE WOULD NOT CREATE USER BECAUSE WE HAVE REGISTER FUNCTION IN AUTH


//READ ALL
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users)
        console.log(users);
        
    } catch (error) {
        res.status(400).json(error)
        console.log(error);
    }
}

//READ ONE
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user)
        console.log(user);
        
    } catch (error) {
        res.status(400).json(error)
        console.log(error);
    }
}


//UPDATE
export const updateUser = async(req, res) => {
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, {new:true})
        res.status(200).json(updateUser)
        console.log(`User "${updated.firstname}" has now been updated! 🐞`)
    } catch (error) {
        res.status(400).json(error)
        console.log(error);
    }
}

//DELETE
export const deleteUser = async(req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has now been deleted! ✂️")
        console.log(`User has now been deleted! ✂️`)
    } catch (error) {
        res.status(400).json(error)
        console.log(error);
    }
}