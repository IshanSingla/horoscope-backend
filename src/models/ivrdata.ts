import mongoose, { Schema, Document } from "mongoose";
const IvrSchema: Schema = new Schema(
    {
        from: String,
        time: String,
        agent_name: String,
        agent_number: String,
        to: String,
        uniqueid: String,
        unix: String,
        status: String,
        total_duration: String,
        agent_duration: String,
        operator: String,
        circle: String,
        extension: String,
        recording: String
    },
    {
        timestamps: true,
        versionKey: false,
    });
export interface Ivr extends Document {
    from: string;
    time: string;
    agent_name: string;
    agent_number: string;
    to: string;
    uniqueid: string;
    unix: string;
    status: string;
    total_duration: string;
    agent_duration: string;
    operator: string;
    circle: string;
    extension: string;
    recording: string;
}
export default mongoose.model<Ivr>("Ivr", IvrSchema);