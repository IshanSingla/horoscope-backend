import mongoose, { Schema, Document } from "mongoose";

interface PlaceOfBirth {
  district?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface Person extends Document  {
  name?: string;
  mobile_number: string;
  whatsapp_number: string;
  dob?: Date;
  place_of_birth?: PlaceOfBirth;
  series_number: 1 | 2 | 3 | 4 | 5;
  createdAt?: Date; // Added for timestamps
  updatedAt?: Date; // Added for timestamps
}


const PersonSchema: Schema = new Schema({
  name: { type: String },
  mobile_number: { type: String, required: true },
  whatsapp_number: { type: String, required: true },
  dob: { type: Date, },
  place_of_birth: {
    district: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
  },
  series_number: { type: Number, required: true, enum: [1, 2, 3, 4, 5] },
}, {
  timestamps: true,
});

export default mongoose.model<Person>("Person", PersonSchema);
