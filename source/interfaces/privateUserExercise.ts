import mongoose, { Document, Schema } from 'mongoose';

interface IPrivateExercise {
    name: string;
}

export default interface IPrivateExerciseList extends Document {
    userId: Schema.Types.ObjectId;
    customExercises: IPrivateExercise[];
}
