import { Document } from 'mongoose';

export default interface ITraining extends Document {
    date: Date;
    workoutType: string;
    workoutPlan: string;
    extraInformation: string;
}
