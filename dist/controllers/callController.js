"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebaseAdmin_1 = __importDefault(require("../services/firebaseAdmin"));
const prisma_1 = require("../configs/prisma");
class CallController {
    async createIVRPre(req, res) {
        try {
            console.log(new Date(Date.now()));
            const newData = await prisma_1.prisma.ivrs.create({
                data: {
                    id: req.query.uniqueid ?? undefined,
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
                    // createdAt: new Date(Date.now()),
                    // updatedAt: new Date(Date.now()),
                },
            });
            console.log(newData);
            const message = {
                notification: {
                    title: "Call is Coming from" + req.query.from ?? req.query.agent_number,
                    body: "Please pick up the call",
                },
                data: {
                    number: req.query.from ?? "",
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
            console.log(error.message);
            res
                .status(500)
                .json({ error: "Error creating call", message: error.message });
        }
    }
    async createIVRPost(req, res) {
        try {
            const existCall = await prisma_1.prisma.ivrs.findUnique({
                where: { id: req.query.uniqueid },
            });
            if (!existCall) {
                const newData = await prisma_1.prisma.ivrs.create({
                    data: {
                        id: req.query.uniqueid,
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
                        // createdAt: new Date(Date.now()),
                        // updatedAt: new Date(Date.now()),
                    },
                });
                res.status(404).json({ error: "Call not found" });
                return;
            }
            const updatedData = await prisma_1.prisma.ivrs.upsert({
                where: { id: req.query.uniqueid },
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
            const lastCall = await prisma_1.prisma.ivrs.findFirst({
                orderBy: {
                    createdAt: "desc",
                },
            });
            const contact = await prisma_1.prisma.contacts.findFirst({
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
}
exports.default = new CallController();
