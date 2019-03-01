const express = require('express');
const router = express.Router();
const UserModel = require('database/models/UserModel');


router.post('/login', async (req, res, next) => {
    const { name } = req.body;
    
    try {
        const existedUser = await UserModel.findOne({ name: name, });

        if (existedUser) {
            res.json(existedUser);
            return;
        }
        
        const newUser = await UserModel.create({ name: name, });
        res.json(newUser);
    } catch (error) {
        next(error);
    }
});


module.exports = router;
