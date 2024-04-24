import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import IUser from '../interfaces/user';

const UserSchema: Schema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        age: { type: Number },
        height: { type: Number },
        weight: { type: Number }
    },
    {
        timestamps: true
    }
);

UserSchema.pre<IUser>('save', function(next) {
    if (!this.isModified('password')) return next();

    bcrypt.hash(this.password, 12)
    .then(hashedPassword => {
        this.password = hashedPassword;
        next();
    })
    .catch(err => next(err));
})

UserSchema.methods.comparePassword = function(candidatePassword: string): Promise<boolean>{
    return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model<IUser>('User', UserSchema);
