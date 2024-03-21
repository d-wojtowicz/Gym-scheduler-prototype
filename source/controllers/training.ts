import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Training from '../models/training';

// POST
const createTraining = (req: Request, res: Response, next: NextFunction) => {
    let { userId, date, workoutType, workoutPlan, extraInformation } = req.body;

    const training = new Training({
        userId,
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
    let query = {};

    if (req.query._id) {
        const id = req.query._id as string;
        query = { _id: { $eq: id } };
    }
    if (req.query.workoutType) {
        const workoutType = req.query.workoutType as string;
        query = { ...query, workoutType: { $eq: workoutType } };
    }

    Training.find(query)
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
            message: 'No date provided.'
        });
    }

    const startOfDay = new Date(trainingsDate).setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(trainingsDate).setUTCHours(23, 59, 59, 999);

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
            });
        });
};

export default {
    createTraining,
    getAllTrainings,
    getTrainingByDate
};
