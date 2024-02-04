"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const callModel_1 = __importDefault(require("../models/callModel"));
const firebaseAdmin_1 = __importDefault(require("../services/firebaseAdmin"));
const callModel_2 = __importDefault(require("../models/callModel"));
const contactModel_1 = __importDefault(require("../models/contactModel"));
class CallController {
    async createCall(req, res) {
        try {
            const message = {
                notification: {
                    title: "Call is Coming from" + req.body.mobile_number,
                    body: "Please pick up the call",
                },
                data: {
                    number: req.body.mobile_number.toString(),
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
            const existCall = await callModel_1.default.findOne({
                mobile_number: req.body.mobile_number,
            });
            if (existCall) {
                const contact = await contactModel_1.default.findOne({
                    mobile_number: req.body.mobile_number,
                });
                res.status(200).json({
                    message: "Call already saved",
                    call: existCall,
                    contact: contact,
                });
                return;
            }
            const call = new callModel_1.default(req.body);
            const savedCall = await call.save();
            res.status(201).json({ message: "call saved", call: savedCall });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }
    async getLastCall(req, res) {
        try {
            const lastCall = await callModel_2.default.find();
            res.status(200).json({
                call: lastCall.reverse()[0],
            });
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
                    message: "Call not found!"
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