import mongoose, { Document, Schema } from 'mongoose';
import ITrainingRow from './training';

interface ISingleTemplate {
    workoutType: string;
    workoutPlan: ITrainingRow[];
    extraInformation: string;
}

export default interface ITemplate extends Document {
    userId: Schema.Types.ObjectId;
    templateA: ISingleTemplate;
    templateB: ISingleTemplate;
}
