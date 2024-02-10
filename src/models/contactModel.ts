import { equal } from "assert";
import mongoose, { Schema, Document } from "mongoose";

interface PlaceOfBirth {
  description?: string;
  latitude?: number;
  longitude?: number;
}

export interface Contact extends Document {
  name?: string;
  mobile_number: string;
  whatsapp_number: string;
  gender?:string;
  dob?: Date;
  place_of_birth?: PlaceOfBirth;
  series_number?: number;
  last_fetched?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const ContactSchema: Schema = new Schema(
  {
    name: {
      type: String,
      require: false,
    },

    mobile_number: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v: any) {
          return /\d{10}/.test(v);
        },
        message: (props: any) => `${props.value} is not a valid mobile number!`,
      },
    },
    whatsapp_number: {
      type: String,
      required: true,
      validate: {
        validator: function (v: any) {
          return /\d{10}/.test(v);
        },
        message: (props: any) => `${props.value} is not a valid mobile number!`,
      },
    },
    gender: {
      type: String,
      required: false,
    },

    dob: { type: Date },
    place_of_birth: {
      description: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
    },
    series_number: {
      type: Number,
      required: true,
      default: 0,
    },
    last_fetched:{
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Contact>("Contact", ContactSchema);
