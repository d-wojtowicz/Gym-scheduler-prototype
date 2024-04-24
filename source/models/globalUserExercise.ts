import mongoose, { Schema } from 'mongoose';
import IGlobalExercise from '../interfaces/globalUserExercise';

const GlobalExerciseSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true }
});

export default mongoose.model<IGlobalExercise>('GlobalExercise', GlobalExerciseSchema);
