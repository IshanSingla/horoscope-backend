import mongoose, { Schema, Document } from "mongoose";

export interface Call extends Document {
  phone_no: string;
}

const CallSchema: Schema = new Schema({
  phone_no: { type: String, required: true },
});

export default mongoose.model<Call>("Call", CallSchema);
