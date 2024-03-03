import { Request, Response } from "express";
import admin from "../services/firebaseAdmin";
import { Message } from "firebase-admin/lib/messaging/messaging-api";
import { prisma } from "../configs/prisma";

class CallController {

  public async createIVRPre(req: Request, res: Response): Promise<void> {
    try {
      console.log(new Date(Date.now()))
      const newData = await prisma.ivrs.create({
        data: {
          from: (req.query.from as string) ?? undefined,
          time: (req.query.time as string) ?? undefined,
          agent_name: (req.query.agent_name as string) ?? undefined,
          agent_number: (req.query.agent_number as string) ?? undefined,
          to: (req.query.to as string) ?? undefined,
          uniqueid: (req.query.uniqueid as string) ?? undefined,
          unix: (req.query.unix as string) ?? undefined,
          status: (req.query.status as string) ?? undefined,
          total_duration: (req.query.total_duration as string) ?? undefined,
          agent_duration: (req.query.agent_duration as string) ?? undefined,
          operator: (req.query.operator as string) ?? undefined,
          circle: (req.query.circle as string) ?? undefined,
          extension: (req.query.extension as string) ?? undefined,
          recording: (req.query.recording as string) ?? undefined,
          // createdAt: new Date(Date.now()),
          // updatedAt: new Date(Date.now()),
        },
      });
      console.log(newData);
      const message: Message = {
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
        admin
          .messaging()
          .send(message)
          .then((response) => {
            console.log("Successfully sent message:", response);
          })
          .catch((error) => {
            console.log("Error sending message:", error);
          });
      } catch (error) {
        console.log(error);
      }

      res.status(200).send(newData);
    } catch (error: any) {
      res
        .status(500)
        .json({ error: "Error creating call", message: error.message });
    }
  }

  public async createIVRPost(req: Request, res: Response): Promise<void> {
    try {
      const existCall = await prisma.ivrs.findUnique({
        where: { id: Number(req.query.uniqueid) },
      });
      if (!existCall) {
        res.status(404).json({ error: "Call not found" });
        return;
      }
      const updatedData = await prisma.ivrs.upsert({
        where: { id: Number(req.query.uniqueid) },
        update: {
          from: (req.query.from as string | undefined) ?? existCall.from,
          time: req.query.time as string | undefined,
          agent_name: req.query.agent_name as string | undefined,
          agent_number: req.query.agent_number as string | undefined,
          to: req.query.to as string | undefined,
          uniqueid: req.query.uniqueid as string | undefined,
          unix: req.query.unix as string | undefined,
          status: req.query.status as string | undefined,
          total_duration: req.query.total_duration as string | undefined,
          agent_duration: req.query.agent_duration as string | undefined,
          operator: req.query.operator as string | undefined,
          circle: req.query.circle as string | undefined,
          extension: req.query.extension as string | undefined,
          recording: req.query.recording as string | undefined,
        },
        create: {
          agent_number: req.query.agent_number as string,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      // Sending message code here
      res.status(200).json({
        message: "Data updated",
        data: updatedData,
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ error: "Error creating call", message: error.message });
    }
  }

  public async getLastCall(req: Request, res: Response): Promise<void> {
    try {
      const lastCall = await prisma.ivrs.findFirst({
        orderBy: {
          createdAt: "desc",
        },
      });
      const contact = await prisma.contacts.findFirst({
        where: {
          mobile_number: lastCall?.agent_number ?? "",
        },
      });
      res.status(200).json(contact ?? lastCall);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving call" });
    }
  }
}

export default new CallController();
