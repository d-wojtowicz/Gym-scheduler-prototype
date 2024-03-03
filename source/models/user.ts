import mongoose, { Schema } from 'mongoose';
import IUser from '../interfaces/user';

const UserSchema: Schema = new Schema(
    {
        username: { Type: String, required: true, unique: true },
        password: { Type: String, required: true },
        age: { Type: Number, required: false },
        height: { Type: Number, required: false },
        weight: { Type: Number, required: false }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IUser>('User', UserSchema);