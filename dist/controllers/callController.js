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
            const from = req.query.from;
            const mobile_number = from.startsWith("0")
                ? from.length === 11 && /^\d{10}$/.test(from.slice(1))
                    ? from.slice(1)
                    : (() => {
                        throw new Error("Mobile number must be 10 digits long after removing leading '0'");
                    })()
                : from.length === 10 && /^\d{10}$/.test(from)
                    ? from
                    : (() => {
                        throw new Error("Mobile number must be 10 digits long");
                    })();
            const newData = await prisma_1.prisma.ivrs.create({
                data: {
                    from: mobile_number ?? undefined,
                    time: req.query.time ?? undefined,
                    agent_number: req.query.agent_number ?? undefined,
                    to: req.query.to ?? undefined,
                    uniqueid: req.query.uniqueid ?? undefined,
                },
            });
            const message = {
                notification: {
                    title: ("Call is Coming from" + mobile_number) ??
                        req.query.agent_number,
                    body: "Please pick up the call",
                },
                data: {
                    number: mobile_number ?? "",
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
            const from = req.query.from;
            const mobile_number = from.startsWith("0")
                ? from.length === 11 && /^\d{10}$/.test(from.slice(1))
                    ? from.slice(1)
                    : (() => {
                        throw new Error("Mobile number must be 10 digits long after removing leading '0'");
                    })()
                : from.length === 10 && /^\d{10}$/.test(from)
                    ? from
                    : (() => {
                        throw new Error("Mobile number must be 10 digits long");
                    })();
            const existCall = await prisma_1.prisma.ivrs.findFirst({
                where: { from: mobile_number },
                orderBy: {
                    time: "desc",
                },
            });
            if (!existCall) {
                res.status(404).send("Call not found");
                return;
            }
            const updatedData = await prisma_1.prisma.ivrs.upsert({
                where: { id: existCall.id },
                update: {
                    from: mobile_number ?? existCall.from,
                    time: req.query.time ?? undefined,
                    agent_number: req.query.agent_number ?? undefined,
                    to: req.query.to ?? undefined,
                    uniqueid: req.query.uniqueid ?? undefined,
                },
                create: {
                    agent_number: req.query.agent_number,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });
            res.status(200).send("Data updated");
        }
        catch (error) {
            console.log(error.message);
            res.status(500).send("Internal Server Error");
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
            res.status(500).json("Error retrieving call");
        }
    }
}
exports.default = new CallController();
