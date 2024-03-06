import { Request, Response } from "express";
import admin from "../services/firebaseAdmin";
import { Message } from "firebase-admin/lib/messaging/messaging-api";
import { prisma } from "../configs/prisma";

class CallController {
  public async createIVRPre(req: Request, res: Response): Promise<void> {
    try {
      const from: string = req.query.from as string;
      const mobile_number: string = from.startsWith("0")
        ? from.length === 11 && /^\d{10}$/.test(from.slice(1))
          ? from.slice(1)
          : (() => {
              throw new Error(
                "Mobile number must be 10 digits long after removing leading '0'"
              );
            })()
        : from.length === 10 && /^\d{10}$/.test(from)
        ? from
        : (() => {
            throw new Error("Mobile number must be 10 digits long");
          })();
      const newData = await prisma.ivrs.create({
        data: {
          from: mobile_number ?? undefined,
          time: (req.query.time as string) ?? undefined,
          agent_number: (req.query.agent_number as string) ?? undefined,
          to: (req.query.to as string) ?? undefined,
          uniqueid: (req.query.uniqueid as string) ?? undefined,
        },
      });
      const message: Message = {
        notification: {
          title:
            (("Call is Coming from" + mobile_number) as string) ??
            (req.query.agent_number as string),
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
      console.log(error.message);
      res
        .status(500)
        .json({ error: "Error creating call", message: error.message });
    }
  }

  public async createIVRPost(req: Request, res: Response): Promise<void> {
    try {
      const from: string = req.query.from as string;
      const mobile_number: string = from.startsWith("0")
        ? from.length === 11 && /^\d{10}$/.test(from.slice(1))
          ? from.slice(1)
          : (() => {
              throw new Error(
                "Mobile number must be 10 digits long after removing leading '0'"
              );
            })()
        : from.length === 10 && /^\d{10}$/.test(from)
        ? from
        : (() => {
            throw new Error("Mobile number must be 10 digits long");
          })();
      const existCall = await prisma.ivrs.findFirst({
        where: { from: mobile_number },
        orderBy: {
          time: "desc",
        },
      });
      if (!existCall) {
        res.status(404).send("Call not found");
        return;
      }

      const updatedData = await prisma.ivrs.upsert({
        where: { id: existCall.id },
        update: {
          from: mobile_number ?? existCall.from,
          time: (req.query.time as string) ?? undefined,
          agent_number: (req.query.agent_number as string) ?? undefined,
          to: (req.query.to as string) ?? undefined,
          uniqueid: (req.query.uniqueid as string) ?? undefined,
        },
        create: {
          agent_number: req.query.agent_number as string,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      res.status(200).send("Data updated");
    } catch (error: any) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
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
      res.status(500).json("Error retrieving call");
    }
  }
}

export default new CallController();
