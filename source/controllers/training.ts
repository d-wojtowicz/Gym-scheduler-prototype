import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Training from '../models/training';

// POST
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

// GET
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
const getTrainingByDate = (req: Request, res: Response, next: NextFunction) => {
    const trainingsDate = req.params.date;

    if (!trainingsDate) {
        return res.status(400).json({
            message: "No date provided."
        });
    }

    const startOfDay = new Date(trainingsDate).setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(trainingsDate).setUTCHours(23, 59, 59, 999);
    console.log(startOfDay, endOfDay)
    Training.find({
        date: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    })
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
        })
    })
};

export default { 
    createTraining, 
    getAllTrainings, 
    getTrainingByDate 
};
