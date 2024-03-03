import { Document } from 'mongoose';

export default interface IUser extends Document {
    username: string;
    password: string;
    age?: number;
    height?: number;
    weight?: number;
}