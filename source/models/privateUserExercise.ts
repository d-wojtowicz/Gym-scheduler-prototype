import mongoose, { Schema } from 'mongoose';
import IPrivateExerciseList from '../interfaces/privateUserExercise';

const PrivateExerciseSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    customExercises: [
        {
            name: { type: String, required: true }
        }
    ]
});

export default mongoose.model<IPrivateExerciseList>('PrivateExerciseList', PrivateExerciseSchema);
