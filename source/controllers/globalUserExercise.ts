import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import globalUserExercise from '../models/globalUserExercise';

// POST
const createGlobalExercise = (req: Request, res: Response, next: NextFunction) => {
    let name = req.body;

    const globalExercise = new globalUserExercise({
        name
    });

    return globalExercise
        .save()
        .then((result) => {
            return res.status(201).json({
                globalExercise: result
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
const getAllGlobalExercises = (req: Request, res: Response, next: NextFunction) => {
    globalUserExercise
        .find()
        .exec()
        .then((results) => {
            return res.status(200).json({
                globalExercise: results,
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

export default {
    createGlobalExercise,
    getAllGlobalExercises
};
