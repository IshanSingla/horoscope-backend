import { Request, Response } from "express";
import ContactModel, { Contact } from "../models/contactModel";
import authModal from "../models/authModal";
import axios from "axios";

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
      const auth = await authModal.findOne({});
      const accessToken = auth?.accessToken;

      const contactData = {
        names: [
          {
            givenName: `${savedContact.name ?? "-"}`,
          },
        ],
        phoneNumbers: [
          {
            value: savedContact.mobile_number,
            type: "Mobile Number",
          },
          {
            type: "WhatsApp Number",
            value: savedContact.whatsapp_number,
          },
        ],
        birthdays: [
          {
            date: {
              day: ((savedContact?.dob?.getDate() ?? 0) % 31) + 1, // Ensure day remains within the range 1-31
              month: (((savedContact?.dob?.getMonth() ?? 0) + 1) % 12) + 1, // Ensure month remains within the range 1-12
              year: (savedContact?.dob?.getFullYear() ?? 0) + 1,
            },
          },
        ],
        addresses: [
          {
            type: "Birth of Place",
            city: savedContact?.place_of_birth?.description,
          },
        ],
        genders: [
          {
            value: savedContact?.gender,
          },
        ],
      };
      try {
        const response = await axios.post(
          "https://people.googleapis.com/v1/people:createContact",
          contactData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            params: {
              sources: "READ_SOURCE_TYPE_CONTACT",
              access_token: auth?.accessToken,
              alt: "json",
            },
          }
        );
      } catch (error: any) {
        console.log(error?.response?.data);
      }

      res.status(201).json({
        message: "Contact created successfully",
        contact: savedContact,
      });

      return;
    } catch (error: any) {
      console.log(error.message);
      res
        .status(500)
        .json({ error: error.message || "Error creating contact" });
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

  public async getNewContacts(request: Request, response: Response) {
    try {
      const nonFetchedContacts: Contact[] = await ContactModel.find({
        last_fetched: { $eq: null },
      });
      await Promise.all(nonFetchedContacts.map(async (contact) => {
        contact.last_fetched = new Date();
        await contact.save();
      }));

      response.status(200).json({
        message: "Contact retrieved successfully",
        contact: nonFetchedContacts,
      });
    } catch (error: any) {
      response.status(500).json({
        error: error.message || "Internal server error",
      });
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
