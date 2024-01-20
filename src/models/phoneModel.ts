import mongoose, { Schema, Document } from "mongoose";

export interface Phone extends Document {
  phone_no: string;
}

const PhoneSchema: Schema = new Schema({
  phone_no: { type: String, required: true },
});

export default mongoose.model<Phone>("Phone", PhoneSchema);
