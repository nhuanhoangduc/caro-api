const express = require('express');
const hyperid = require('hyperid');
const _ = require('lodash');

const UserModel = require('database/models/UserModel');
const ScoreModel = require('database/models/ScoreModel');

const router = express.Router();
const instance = hyperid();
const availableRooms = {}; // roomId: firstUserId


// Create a room
router.post('/join', async (req, res, next) => {
    try {
        const { userId } = req.body;
        const availableRoomsCounter = _.keys(availableRooms).length;

        if (availableRoomsCounter === 0) { // Create new room
            const roomId = instance();
            availableRooms[roomId] = userId;
            res.json({
                isNewRoomCreated: true,
                roomId: roomId,
            });
        } else {
            const roomId = _.keys(availableRooms)[0];
            const firstUserId = availableRooms[roomId];
            const secondUserId = userId;
            
            const [firstUserInfo, secondUserInfo] = await Promise.all([
                await UserModel.findOne({ _id: firstUserId, }),
                await UserModel.findOne({ _id: secondUserId, })
            ]); 

            let score = await ScoreModel.findOne({
                firstUserId: firstUserId < secondUserId ? firstUserId : secondUserId,
                secondUserId: firstUserId < secondUserId ? secondUserId : firstUserId,
            });

            if (!score) {
                score = await ScoreModel.create({
                    firstUserId: firstUserId < secondUserId ? firstUserId : secondUserId,
                    secondUserId: firstUserId < secondUserId ? secondUserId : firstUserId,
                    firstUserScore: 0,
                    secondUserScore: 0,
                });
            }

            delete availableRooms[roomId];

            res.json({
                isNewRoomCreated: false,
                roomId: roomId,
                score: score,
                firstUser: firstUserInfo,
                secondUser: secondUserInfo,
            });
        }
    } catch (error) {
        next(error);
    }
});


module.exports = router;
