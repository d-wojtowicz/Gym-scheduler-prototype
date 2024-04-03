import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import privateUserExercise from '../models/privateUserExercise';

// POST
const createPrivateExercise = (req: Request, res: Response, next: NextFunction) => {
    let { userId, customExercises } = req.body;

    const privateExercise = new privateUserExercise({
        userId,
        customExercises
    });

    return privateExercise
        .save()
        .then((result) => {
            return res.status(201).json({
                privateExercise: result
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

// GET
const getAllPrivateExercises = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user ?? null;
    let query = {};

    if (user) {
        const id = user.userId as string;
        query = { userId: { $eq: id } };
    } else {
        return res.status(500).json({
            message: 'The token was not found.'
        });
    }

    privateUserExercise
        .find(query)
        .exec()
        .then((results) => {
            return res.status(200).json({
                privateExercise: results
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

export default {
    createPrivateExercise,
    getAllPrivateExercises
};
