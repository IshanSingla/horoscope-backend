"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebaseAdmin_1 = __importDefault(require("../services/firebaseAdmin"));
const index_1 = require("../index");
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
            const newCall = await index_1.prisma.ivrs.create({
                data: {
                    agent_number: req.body.mobile_number,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });
            res.status(201).json({ message: "call saved", call: newCall });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }
    async createIVRPre(req, res) {
        try {
            const newData = await index_1.prisma.ivrs.create({
                data: {
                    from: req.query.from ?? undefined,
                    time: req.query.time ?? undefined,
                    agent_name: req.query.agent_name ?? undefined,
                    agent_number: req.query.agent_number ?? undefined,
                    to: req.query.to ?? undefined,
                    uniqueid: req.query.uniqueid ?? undefined,
                    unix: req.query.unix ?? undefined,
                    status: req.query.status ?? undefined,
                    total_duration: req.query.total_duration ?? undefined,
                    agent_duration: req.query.agent_duration ?? undefined,
                    operator: req.query.operator ?? undefined,
                    circle: req.query.circle ?? undefined,
                    extension: req.query.extension ?? undefined,
                    recording: req.query.recording ?? undefined,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });
            console.log(newData);
            const message = {
                notification: {
                    title: "Call is Coming from" + req.body.from ?? req.body.agent_number,
                    body: "Please pick up the call",
                },
                data: {
                    number: req.body.from ?? "",
                },
                android: {
                    priority: "high",
                },
                topic: "calls",
                // token: 'fcm_token',
            };
            try {
                firebaseAdmin_1.default
                    .messaging()
                    .send(message)
                    .then((response) => {
                    console.log("Successfully sent message:", response);
                })
                    .catch((error) => {
                    console.log("Error sending message:", error);
                });
            }
            catch (error) {
                console.log(error);
            }
            res.status(200).send(newData);
        }
        catch (error) {
            res
                .status(500)
                .json({ error: "Error creating call", message: error.message });
        }
    }
    async createIVRPost(req, res) {
        try {
            const existCall = await index_1.prisma.ivrs.findUnique({
                where: { id: Number(req.query.uniqueid) },
            });
            if (!existCall) {
                res.status(404).json({ error: "Call not found" });
                return;
            }
            const updatedData = await index_1.prisma.ivrs.upsert({
                where: { id: Number(req.query.uniqueid) },
                update: {
                    from: req.query.from ?? existCall.from,
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
                    recording: req.query.recording,
                },
                create: {
                    agent_number: req.query.agent_number,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });
            // Sending message code here
            res.status(200).json({
                message: "Data updated",
                data: updatedData,
            });
        }
        catch (error) {
            res
                .status(500)
                .json({ error: "Error creating call", message: error.message });
        }
    }
    async getLastCall(req, res) {
        try {
            const lastCall = await index_1.prisma.ivrs.findFirst({
                orderBy: {
                    createdAt: "desc",
                },
            });
            const contact = await index_1.prisma.contacts.findFirst({
                where: {
                    mobile_number: lastCall?.agent_number ?? "",
                },
            });
            res.status(200).json(contact ?? lastCall);
        }
        catch (error) {
            res.status(500).json({ error: "Error retrieving call" });
        }
    }
    async getCall(req, res) {
        try {
            const call = await index_1.prisma.ivrs.findMany();
            res.status(200).json({ call: call });
        }
        catch (error) {
            res.status(500).json({ error: "Error retrieving call" });
        }
    }
    async updateCall(req, res) {
        try {
            const existCall = await index_1.prisma.ivrs.findUnique({
                where: {
                    id: parseInt(req.params.id),
                },
            });
            if (!existCall) {
                res.status(404).json({
                    message: "Call not found!",
                });
            }
            const updatedCall = await index_1.prisma.ivrs.update({
                where: {
                    id: parseInt(req.params.id),
                },
                data: req.body,
                select: {
                    id: true,
                    agent_number: true,
                },
            });
            res.status(203).json(updatedCall);
        }
        catch (error) {
            res.status(500).json({ error: "Error updating call" });
        }
    }
    async deleteCall(req, res) {
        try {
            await index_1.prisma.ivrs.delete({
                where: {
                    id: parseInt(req.params.id),
                },
            });
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
