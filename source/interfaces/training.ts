import mongoose, { Document, Schema } from 'mongoose';

interface IExercise {
    type: string;
    weight_load: number;
    sets: number;
    repetitions: number;
    notes?: string;
}

export default interface ITraining extends Document {
    userId: Schema.Types.ObjectId;
    date: Date;
    workoutType: string;
    workoutPlan: IExercise[];
    extraInformation: string;
}
