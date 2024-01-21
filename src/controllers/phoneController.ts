import { Request, Response } from "express";
import PhoneModel, { Phone } from "../models/phoneModel";
import admin from "../services/firebaseAdmin";
import { Message } from "firebase-admin/lib/messaging/messaging-api";

class PhoneController {
  public async createPhone(req: Request, res: Response): Promise<void> {
    try {
      const phone = new PhoneModel(req.body);
      const savedPhone = await phone.save();
      const message: Message = {
        notification: {
          title: 'Call is Coming from ' + savedPhone.phone_no,
          body: 'Please pick up the call',
        },
        data: {
          number: savedPhone.phone_no,
        },
        android: {
          priority: 'high',
        },
        topic: 'calls',
        // token: 'fcm_token',
      };
      admin.messaging().send(message)
        .then((response) => {
          console.log('Successfully sent message:', response);
        })
        .catch((error) => {
          console.log('Error sending message:', error);
        });
      res.status(201).json(savedPhone);
    } catch (error) {
      res.status(500).json({ error: "Error creating phone" });
    }
  }

  public async getPhone(req: Request, res: Response): Promise<void> {
    try {
      const phone = await PhoneModel.findOne();
      res.status(200).json(phone);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving phone" });
    }
  }

  public async updatePhone(req: Request, res: Response): Promise<void> {
    try {
      const updatedPhone = await PhoneModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      res.status(200).json(updatedPhone);
    } catch (error) {
      res.status(500).json({ error: "Error updating phone" });
    }
  }

  public async deletePhone(req: Request, res: Response): Promise<void> {
    try {
      await PhoneModel.findByIdAndDelete(req.params.id);
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ error: "Error deleting phone" });
    }
  }
}

export default new PhoneController();
