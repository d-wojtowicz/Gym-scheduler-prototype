import mongoose, { Schema } from 'mongoose';
import ITraining from '../interfaces/training';

const TrainingSchema: Schema = new Schema(
    {
        date: { type: Date, required: true },
        workoutType: { type: String, required: true },
        workoutPlan: { type: String, required: true },
        extraInformation: { type: String, required: false }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ITraining>('Training', TrainingSchema);
