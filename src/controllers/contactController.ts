import { Request, Response } from "express";
import ContactModel, { Contact } from "../models/contactModel";

class ContactController {
  public async createContact(req: Request, res: Response): Promise<void> {
    try {
      const contactExist = await ContactModel.findOne({
        mobile_number: req.body.mobile_number,
      });
      if (contactExist) {
        res
          .status(200)
          .json({ message: "Contact already created!", contact: contactExist });
        return;
      }
      const contact = new ContactModel(req.body);
      const savedContact = await contact.save();
      res.status(201).json({
        message: "Contact created successfully",
        contact: savedContact,
      });
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error creating contact" });
    }
  }

  public async getAllContact(req: Request, res: Response): Promise<void> {
    try {
      const contact = await ContactModel.find();
      res.status(200).json(contact);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error retrieving contact" });
    }
  }

  public async getContact(req: Request, res: Response): Promise<void> {
    try {
      const contact = await ContactModel.findOne({ _id: req.params.id });
      res.status(200).json(contact);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving contact" });
    }
  }

  public async updateContact(req: Request, res: Response): Promise<void> {
    try {
      const updatedContact = await ContactModel.findByIdAndUpdate(
        req.params.id,
        { updatedAt: new Date(), ...req.body },
        {
          new: true,
        }
      );
      res.status(200).json({ message: "Contact updated", updatedContact });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error updating contact" });
    }
  }

  public async deleteContact(req: Request, res: Response): Promise<void> {
    try {
      await ContactModel.findByIdAndDelete(req.params.id);
      res.status(204).json({
        message: "Contact Deleted",
      });
    } catch (error) {
      res.status(500).json({ error: "Error deleting contact" });
    }
  }

  public async isMobileNumber(req: Request, res: Response): Promise<void> {
    try {
      let mobile_number = req.body.mobile_number;
      if (typeof req.body.mobile_number === "string") {
        mobile_number = parseInt(req.body.mobile_number);
      }
      if (/\d{10}/.test(mobile_number)) {
        res.status(200).json({
          message: "Number is valid",
        });
        return;
      }
      res.status(500).json({
        message: "Number is invalid",
      });
      return;
    } catch (error: any) {
      console.log(error.message);
      res.status(500).json({
        error: error.message,
      });
    }
  }
}

export default new ContactController();
