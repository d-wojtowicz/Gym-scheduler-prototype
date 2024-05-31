import { Request, Response, NextFunction } from 'express';
import measurement from '../models/measurement';
import { json } from 'body-parser';

// GET
const getAllMeasurements = (req: Request, res: Response, next: NextFunction) => {};

// PUT
const addMeasurement = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user ?? null;
    let id = '';
    let measurements = req.body.measurements;

    if (user) {
        id = user.userId as string;
    } else {
        return res.status(500).json({
            message: 'The token was not found.'
        });
    }

    measurement
        .updateOne({ userId: id }, { $push: { measurements: { $each: measurements } } }, { upsert: true })
        .then((result) => {
            if (result.matchedCount === 0) {
                return res.status(404).json({
                    message: 'User not found.'
                });
            }
            return res.status(200).json({
                message: 'Custom measurement added successfully.'
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
    getAllMeasurements,
    addMeasurement
};
