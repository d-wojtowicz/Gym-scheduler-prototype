import mongoose, { Schema } from 'mongoose';
import ITemplate from '../interfaces/template';

const ExerciseSchema: Schema = new Schema({
    name: { type: String, required: true },
    weightLoad: { type: Number },
    sets: { type: Number, required: true },
    repetitions: { type: Number, required: true },
    notes: { type: String }
});

const SingleTemplateSchema: Schema = new Schema({
    workoutType: { type: String, required: true },
    workoutPlan: { type: [ExerciseSchema], required: true },
    extraInformation: { type: String }
});

const TemplateSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        templateA: { type: SingleTemplateSchema, required: true },
        templateB: { type: SingleTemplateSchema, required: true }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ITemplate>('Template', TemplateSchema);
