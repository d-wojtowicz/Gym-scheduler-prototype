import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Training from '../models/training';


const createTraining = (req: Request, res: Response, next: NextFunction) => {
    let { date, workoutType, workoutPlan, extraInformation } = req.body;

    const training = new Training({
        _id: new mongoose.Types.ObjectId(),
        date,
        workoutType, 
        workoutPlan,
        extraInformation
    });

    return training
    .save()
    .then((result) => {
        return res.status(201).json({
            training: result
        });
    })
    .catch((error) => {
        return res.status(500).json({
            message: error.message,
            error
        });
    });
};

const getAllTrainings = (req: Request, res: Response, next: NextFunction) => {
    Training.find()
    .exec()
    .then((results) => {
        return res.status(200).json({
            trainings: results,
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

export default { createTraining, getAllTrainings };
