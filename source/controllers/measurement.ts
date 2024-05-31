import { Request, Response, NextFunction } from 'express';
import measurement from '../models/measurement';

// GET
const getAllMeasurements = (req: Request, res: Response, next: NextFunction) => {};

// POST
const addMeasurement = (req: Request, res: Response, next: NextFunction) => {};

export default {
    getAllMeasurements,
    addMeasurement
};
