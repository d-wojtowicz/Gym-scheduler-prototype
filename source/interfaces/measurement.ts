import mongoose, { Document, Schema } from 'mongoose';

interface IMeasurementRow {
    date: Date;
    weight?: number;
    chest?: number;
    waist?: number;
    stomach?: number;
    muffin_top?: number;
    biceps_l?: number;
    biceps_r?: number;
    thigh?: number;
    calf?: number;
}

export default interface IMeasurement extends Document {
    userId: Schema.Types.ObjectId;
    measurements: IMeasurementRow[];
}
