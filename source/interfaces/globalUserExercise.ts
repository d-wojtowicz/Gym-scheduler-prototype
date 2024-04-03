import mongoose, { Document, Schema } from 'mongoose';

export default interface IGlobalExercise extends Document {
    name: string;
}
