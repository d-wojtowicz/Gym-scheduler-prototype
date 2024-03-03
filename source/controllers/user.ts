import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import User from '../models/user';

//POST
const createUser = (req: Request, res: Response, next: NextFunction) => {
    let { username, password, age, height, weight } = req.body;

    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username,
        password,
        age,
        height,
        weight
    });

    return user
        .save()
        .then((result) => {
            return res.status(201).json({
                user: result
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

//GET
const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
    User.find()
        .exec()
        .then((results) => {
            return res.status(200).json({
                users: results,
                count: results.length
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};
const getUserByID = (req: Request, res: Response, next: NextFunction) => {
    const userID = req.params._id as string;

    if (!userID) {
        return res.status(400).json({
            message: 'No date provided.'
        });
    }

    User.find({
        _id: { $eq: userID }
    })
        .exec()
        .then((result) => {
            return res.status(200).json({
                user: result
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

//UPDATE
const updateUser = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params._id;
    const { password, age, height, weight } = req.body;

    const updateData = {
        password,
        age,
        height,
        weight
    };

    User.findByIdAndUpdate(userId, { $set: updateData }, { new: true })
        .exec()
        .then((result) => {
            res.status(200).json({
                user: result
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: error.message,
                error
            });
        });
};

//DELETE
const deleteUser = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params._id;
    User.findByIdAndDelete(userId)
        .exec()
        .then((result) => {
            res.status(200).json({
                result
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: error.message,
                error
            });
        });
};

export default {
    createUser,
    getAllUsers,
    getUserByID,
    updateUser,
    deleteUser
};
