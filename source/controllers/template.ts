import { Request, Response, NextFunction } from 'express';
import Template from '../models/template';

// UPDATE
const updateTemplate = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user ?? null;
    const templateNum = req.params.templateNum;
    const { workoutType, workoutPlan, extraInformation } = req.body;

    if (user) {
        const userId = user.userId as string;
        const templateKey = `template${templateNum}`;

        const updateData = {
            [`${templateKey}.workoutType`]: workoutType,
            [`${templateKey}.workoutPlan`]: workoutPlan,
            [`${templateKey}.extraInformation`]: extraInformation
        };

        Template.findOneAndUpdate({ userId: userId }, { $set: updateData }, { new: true, upsert: true })
            .then((results) => {
                return res.status(200).json({
                    template: results
                });
            })
            .catch((error) => {
                res.status(500).json({
                    message: error.message,
                    error
                });
            });
    } else {
        res.status(500).json({
            message: 'The token was not found.'
        });
    }
};

export default {
    updateTemplate
};
