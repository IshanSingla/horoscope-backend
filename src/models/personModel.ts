import mongoose, { Schema, Document } from "mongoose";

export interface Person extends Document {
  name: string;
  mobile_number: string;
  whatsapp_number: string;
  dob: string;
  place_of_birth: string;
  series_number: string;
}

const PersonSchema: Schema = new Schema({
  name: { type: String, required: true },
  mobile_number: { type: String, required: true },
  whatsapp_number: { type: String, required: true },
  dob: { type: String, required: true },
  place_of_birth: { type: String, required: true },
  series_number: { type: String, required: true },
});

export default mongoose.model<Person>("Person", PersonSchema);
