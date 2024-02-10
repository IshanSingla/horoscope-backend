import mongoose, { Schema, Document } from "mongoose";

export interface IAuth extends Document {
  accessToken: string;
  refreshToken: string;
  name: string;
  email: string;
}

const AuthSchema: Schema = new Schema(
  {
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model<IAuth>("Auth", AuthSchema);
