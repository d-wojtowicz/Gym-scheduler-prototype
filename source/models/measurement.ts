import mongoose, { Schema } from 'mongoose';
import IMeasurement from '../interfaces/measurement';

const MeasurementRowSchema: Schema = new Schema({
    date: { type: Date, required: true },
    weight: { type: Number },
    chest: { type: Number },
    waist: { type: Number },
    stomach: { type: Number },
    muffin_top: { type: Number },
    biceps_l: { type: Number },
    biceps_p: { type: Number },
    thigh: { type: Number },
    calf: { type: Number }
});

const MeasurementSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        measurements: [MeasurementRowSchema]
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IMeasurement>('Measurement', MeasurementSchema);
