import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';

const NAMESPACE = 'Training Controller';

const getAllTrainings = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, `Training health check route called.`);

    return res.status(200).json({
        message: 'pong'
    });
};

export default { getAllTrainings };
