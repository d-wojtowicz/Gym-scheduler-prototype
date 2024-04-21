import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Training from '../models/training';

// POST
const createTraining = (req: Request, res: Response, next: NextFunction) => {
    let { date, workoutType, workoutPlan, extraInformation } = req.body;
    const user = req.user ?? null;
    let userId = '';

    if (user) {
        userId = user.userId;
    }
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
    /* // Must learn how to pass req.query parameters safely so as to use them
    if (req.query.workoutType) {
        const workoutType = req.query.workoutType as string;
        query = { ...query, workoutType: { $eq: workoutType } };
    } 
    */

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

// DELETE
const removeTraining = (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;

    if (!_id) {
        return res.status(400).json({
            message: 'No training ID provided.'
        });
    }

    Training.findById(_id)
        .exec()
        .then((training) => {
            if (!training) {
                return res.status(404).json({
                    message: 'Training not found.'
                });
            }

            // Check if actual user is owner of this training
            const user = req.user ?? null;
            if (user) {
                const userId = user.userId as String;
                const trainingUserId = training.userId.toString();
                if (trainingUserId !== userId) {
                    return res.status(403).json({
                        message: 'Unauthorized to delete this training.'
                    });
                }
            }

            Training.deleteOne({ _id: _id })
                .exec()
                .then(() => {
                    return res.status(200).json({
                        message: 'Training deleted successfully.'
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

export default {
    createTraining,
    getAllTrainings,
    getTrainingByDate,
    removeTraining
};
