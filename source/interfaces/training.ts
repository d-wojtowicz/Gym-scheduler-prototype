import mongoose, { Document, Schema } from 'mongoose';

interface ITrainingRow {
    name: string;
    weightLoad: number;
    sets: number;
    repetitions: number;
    notes?: string;
}

export default interface ITraining extends Document {
    userId: Schema.Types.ObjectId;
    date: Date;
    workoutType: string;
    workoutPlan: ITrainingRow[];
    extraInformation: string;
}
