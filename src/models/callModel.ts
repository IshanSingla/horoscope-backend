import mongoose, { Schema, Document } from "mongoose";

export interface Call extends Document {
  mobile_number: number;
  calledAt: Date
}

const CallSchema: Schema = new Schema({
  mobile_number: {
    type: Number,
    unique:true,
    required: true,
    validate: {
      validator: function (v: any) {
        return /\d{10}/.test(v);
      },
      message: (props: any) => `${props.value} is not a valid mobile number!`,
    },
  },
  calledAt: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.model<Call>("Call", CallSchema);
