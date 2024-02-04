import mongoose, { Schema, Document } from "mongoose";

interface PlaceOfBirth {
  district?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface Contact extends Document {
  name?: string;
  mobile_number: string;
  whatsapp_number: string;
  dob?: Date;
  place_of_birth?: PlaceOfBirth;
  // series_number: 1 | 2 | 3 | 4 | 5;
  createdAt?: Date;
  updatedAt?: Date;
}

const ContactSchema: Schema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },

    mobile_number: {
      type: Number,
      required: true,
      unique: true,
    },

    whatsapp_number: {
      type: Number,
      required: false,
    },

    gender: {
      type: String,
      enum: ["male", "female", "not specified"],
      required: true,
    },

    dob: { type: Date },
    place_of_birth: {
      district: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
    },
    updatedAt: {
      type: Date,
      default: new Date(),
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    // series_number: { type: Number, required: true, enum: [1, 2, 3, 4, 5] },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Contact>("Contact", ContactSchema);
