import mongoose, { Document } from 'mongoose';

export default interface ITraining extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    date: Date;
    workoutType: string;
    workoutPlan: string;
    extraInformation: string;
}
