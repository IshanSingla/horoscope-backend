import { Request, Response } from "express";
import CallModel, { Call } from "../models/callModel";
import admin from "../services/firebaseAdmin";
import { Message } from "firebase-admin/lib/messaging/messaging-api";
import callModel from "../models/callModel";
import { stringify } from "querystring";
import contactModel from "../models/contactModel";

class CallController {
  public async createCall(req: Request, res: Response): Promise<void> {
    try {
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


        const call = new CallModel(req.body);
        const savedCall = await call.save();
        res.status(201).json({ message: "call saved", call: savedCall });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }

  public async getLastCall(req: Request, res: Response): Promise<void> {
    try {
      let lastCall = await callModel.findOne({}).sort({ calledAt: - 1 });
      const contact =await  contactModel.findOne({
        mobile_number: lastCall?.mobile_number
      })
      console.log(contact)
      res.status(200).send(contact ?? lastCall);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving call" });
    }
  }

  public async getCall(req: Request, res: Response): Promise<void> {
    try {
      const call = await CallModel.find();
      res.status(200).json({ call: call });
    } catch (error) {
      res.status(500).json({ error: "Error retrieving call" });
    }
  }

  public async updateCall(req: Request, res: Response): Promise<void> {
    try {
      const existCall = await CallModel.findById(req.params.id);
      if (!existCall) {
        res.status(404).json({
          message: "Call not found!",
        });
      }
      const updatedCall = await CallModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      res.status(203).json(updatedCall);
    } catch (error) {
      res.status(500).json({ error: "Error updating call" });
    }
  }

  public async deleteCall(req: Request, res: Response): Promise<void> {
    try {
      await CallModel.findByIdAndDelete(req.params.id);
      res.status(204).json({
        message: "Call delete successfully",
      });
    } catch (error) {
      res.status(500).json({ error: "Error deleting call" });
    }
  }
}

export default new CallController();
