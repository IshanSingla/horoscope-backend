import { Request, Response } from "express";
import CallModel from "../models/callModel";
import admin from "../services/firebaseAdmin";
import { Message } from "firebase-admin/lib/messaging/messaging-api";
import contactModel from "../models/contactModel";
import ivrdata from "../models/ivrdata";

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


      const call = new CallModel({
        mobile_number: req.body.mobile_number,
        calledAt: new Date(),
      });
      const savedCall = await call.save();
      res.status(201).json({ message: "call saved", call: savedCall });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }

  public async createIVRPre(req: Request, res: Response): Promise<void> {
    const newData = new ivrdata({
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
    await newData.save()
    const message: Message = {
      notification: {
        title: "Call is Coming from" + req.body.from,
        body: "Please pick up the call",
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
    admin
      .messaging()
      .send(message)
      .then((response) => {
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
    res.status(200).send("Data saved")
  }
  public async createIVRPost(req: Request, res: Response): Promise<void> {

    await ivrdata.findOneAndUpdate({ uniqueid: req.query.uniqueid }, {
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
    }, {
      upsert: true,
      new: true,
    });
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
    admin
      .messaging()
      .send(message)
      .then((response) => {
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
    res.status(200).send("Data saved")
  }

  public async getLastCall(req: Request, res: Response): Promise<void> {
    try {
      let lastCall = await ivrdata.findOne({}).sort({ createdAt: - 1 });
      const contact = await contactModel.findOne({
        mobile_number: lastCall?.from
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
