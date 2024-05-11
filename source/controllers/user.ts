import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import User from '../models/user';
import jwt from 'jsonwebtoken';

//POST
const createUser = (req: Request, res: Response, next: NextFunction) => {
    let { username, password, password_rep, age, height, weight } = req.body;

    // Check if username is not taken yet
    User.findOne({ username: username })
        .then((existingUser) => {
            if (existingUser) {
                // Error 409 Conflict
                return res.status(409).json({
                    message: 'Username is taken'
                });
            }

            // Check if passwords are matched
            if (password != password_rep) {
                return res.status(400).json({
                    message: 'Passwords do not match'
                });
            }

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
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};
const loginUser = (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    User.findOne({ username })
        .exec()
        .then((user) => {
            if (!user) {
                return res.status(401).json({
                    message: 'The user with the given name does not exist.'
                });
            }
            user.comparePassword(password)
                .then((isMatch) => {
                    if (!isMatch) {
                        return res.status(401).json({
                            message: 'Invalid username or password.'
                        });
                    }
                    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
                    res.json({ token });
                })
                .catch((error) => {
                    res.status(500).json({
                        message: error.message,
                        error
                    });
                });
        })
        .catch((error) => {
            res.status(500).json({
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
    const user = req.user ?? null;
    let query = {};

    if (user) {
        const id = user.userId as string;
        query = { _id: { $eq: id } };
    } else {
        return res.status(500).json({
            message: 'The token was not found.'
        });
    }

    User.find({ query })
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
    loginUser,
    getAllUsers,
    getUserByID,
    updateUser,
    deleteUser
};
