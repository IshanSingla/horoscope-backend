import { Request, Response } from "express";
import CallModel from "../models/callModel";
import admin from "../services/firebaseAdmin";
import { Message } from "firebase-admin/lib/messaging/messaging-api";
import contactModel from "../models/contactModel";
import ivrdata from "../models/ivrdata";
import { prisma } from "../index";

class CallController {
  public async createCall(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body.mobile_number) {
        res.status(400).json({ error: "Mobile number is required" });
        return;
      }
      const message: Message = {
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
      admin
        .messaging()
        .send(message)
        .then((response) => {
          console.log("Successfully sent message:", response);
        })
        .catch((error) => {
          console.log("Error sending message:", error);
        });

      const newCall = await prisma.ivrs.create({
        data: {
          agent_number: req.body.mobile_number,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      res.status(201).json({ message: "call saved", call: newCall });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }

  public async createIVRPre(req: Request, res: Response): Promise<void> {
    try {
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
          createdAt: new Date(),
          updatedAt: new Date(),
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
      res.status(200).send("Data saved");
    } catch (error: any) {
      res
        .status(500)
        .json({ error: "Error creating call", message: error.message });
    }
  }

  public async createIVRPost(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.query.uniqueid)
      const updatedData = await ivrdata.findOneAndUpdate(
        { uniqueid: req.query.uniqueid },
        {
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
          recording: req.query.recording,
        },
        {
          upsert: true,
          new: true,
        }
      );
      console.log(updatedData)
      const message: Message = {
        notification: {
          title: "Call is Completed from" + req.body.from,
          body: "Completed",
        },
        data: {
          number: req.body.from,
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
      res.status(200).send("Data saved");
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
          mobile_number: lastCall?.agent_number ?? "", // Add null check here and provide a default value
        },
      });
      res.status(200).send(contact ?? lastCall);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving call" });
    }
  }

  public async getCall(req: Request, res: Response): Promise<void> {
    try {
      const call = await prisma.ivrs.findMany();
      res.status(200).json({ call: call });
    } catch (error) {
      res.status(500).json({ error: "Error retrieving call" });
    }
  }

  public async updateCall(req: Request, res: Response): Promise<void> {
    try {
      const existCall = await prisma.ivrs.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      });

      if (!existCall) {
        res.status(404).json({
          message: "Call not found!",
        });
      }
      const updatedCall = await prisma.ivrs.update({
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
    } catch (error) {
      res.status(500).json({ error: "Error updating call" });
    }
  }

  public async deleteCall(req: Request, res: Response): Promise<void> {
    try {
      await prisma.ivrs.delete({
        where: {
          id: parseInt(req.params.id),
        },
      });
      res.status(204).json({
        message: "Call delete successfully",
      });
    } catch (error) {
      res.status(500).json({ error: "Error deleting call" });
    }
  }
}

export default new CallController();
