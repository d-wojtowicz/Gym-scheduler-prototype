import mongoose, { Schema } from 'mongoose';
import ITraining from '../interfaces/training';

const ExerciseSchema: Schema = new Schema({
    name: { type: String, required: true },
    weightLoad: { type: Number },
    sets: { type: Number, required: true },
    repetitions: { type: Number, required: true },
    notes: { type: String }
});

const TrainingSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        date: { type: Date, required: true },
        workoutType: { type: String, required: true },
        workoutPlan: { type: [ExerciseSchema], required: true },
        extraInformation: { type: String }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ITraining>('Training', TrainingSchema);
