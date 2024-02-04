import { Request, Response } from "express";
import CallModel, { Call } from "../models/callModel";
import admin from "../services/firebaseAdmin";
import { Message } from "firebase-admin/lib/messaging/messaging-api";

class CallController {
  public async createCall(req: Request, res: Response): Promise<void> {
    try {
      const message: Message = {
        notification: {
          title: "Call is Coming from " + req.body.phone_no,
          body: "Please pick up the call",
        },
        data: {
          number: req.body.phone_no,
        },
        android: {
          priority: "high",
        },
        topic: "calls",
        // token: 'fcm_token',
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
      res.status(201).json("savedCall");
    } catch (error) {
      res.status(500).json({ error: "Error creating phone" });
    }
  }

  public async getLastCall(req: Request, res: Response): Promise<void> {
    try {
      // const lastCall = 

    } catch (error) {
      res.status(500).json({ error: "Error retrieving phone" });
    }
  }

  public async getCall(req: Request, res: Response): Promise<void> {
    try {
      const phone = await CallModel.findOne();
      res.status(200).json(phone);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving phone" });
    }
  }

  public async updateCall(req: Request, res: Response): Promise<void> {
    try {
      const updatedCall = await CallModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      res.status(200).json(updatedCall);
    } catch (error) {
      res.status(500).json({ error: "Error updating phone" });
    }
  }

  public async deleteCall(req: Request, res: Response): Promise<void> {
    try {
      await CallModel.findByIdAndDelete(req.params.id);
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ error: "Error deleting phone" });
    }
  }
}

export default new CallController();
