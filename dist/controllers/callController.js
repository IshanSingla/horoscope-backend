"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const callModel_1 = __importDefault(require("../models/callModel"));
const firebaseAdmin_1 = __importDefault(require("../services/firebaseAdmin"));
const callModel_2 = __importDefault(require("../models/callModel"));
const contactModel_1 = __importDefault(require("../models/contactModel"));
const ivrdata_1 = __importDefault(require("../models/ivrdata"));
class CallController {
    async createCall(req, res) {
        try {
            if (!req.body.mobile_number) {
                res.status(400).json({ error: "Mobile number is required" });
                return;
            }
            const message = {
                notification: {
                    title: "Call is Coming from" + req.body.mobile_number,
                    body: "Please pick up the call",
                },
                data: {
                    number: req.body.mobile_number,
                },
                android: {
                    priority: "high",
                },
                topic: "calls",
                // token: 'fcm_token',
            };
            firebaseAdmin_1.default
                .messaging()
                .send(message)
                .then((response) => {
                console.log("Successfully sent message:", response);
            })
                .catch((error) => {
                console.log("Error sending message:", error);
            });
            const call = new callModel_1.default({
                mobile_number: req.body.mobile_number,
                calledAt: new Date(),
            });
            const savedCall = await call.save();
            res.status(201).json({ message: "call saved", call: savedCall });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }
    async createIVR(req, res) {
        const newData = new ivrdata_1.default({
            from: req.query.from,
            time: req.query.time,
            agent_name: req.query.agent_name,
            agent_number: req.query.agent_number,
            to: req.query.to,
            uniqueid: req.query.uniqueid,
            unix: req.query.unix,
            status: req.query.status,
            total_duration: req.query.total_duration,
            agent_duration: req.query.agent_duration,
            operator: req.query.operator,
            circle: req.query.circle,
            extension: req.query.extension,
            recording: req.query.recording
        });
        await newData.save();
        res.status(200).send("Data saved");
    }
    async getLastCall(req, res) {
        try {
            let lastCall = await callModel_2.default.findOne({}).sort({ calledAt: -1 });
            const contact = await contactModel_1.default.findOne({
                mobile_number: lastCall?.mobile_number
            });
            console.log(contact);
            res.status(200).send(contact ?? lastCall);
        }
        catch (error) {
            res.status(500).json({ error: "Error retrieving call" });
        }
    }
    async getCall(req, res) {
        try {
            const call = await callModel_1.default.find();
            res.status(200).json({ call: call });
        }
        catch (error) {
            res.status(500).json({ error: "Error retrieving call" });
        }
    }
    async updateCall(req, res) {
        try {
            const existCall = await callModel_1.default.findById(req.params.id);
            if (!existCall) {
                res.status(404).json({
                    message: "Call not found!",
                });
            }
            const updatedCall = await callModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            });
            res.status(203).json(updatedCall);
        }
        catch (error) {
            res.status(500).json({ error: "Error updating call" });
        }
    }
    async deleteCall(req, res) {
        try {
            await callModel_1.default.findByIdAndDelete(req.params.id);
            res.status(204).json({
                message: "Call delete successfully",
            });
        }
        catch (error) {
            res.status(500).json({ error: "Error deleting call" });
        }
    }
}
exports.default = new CallController();
