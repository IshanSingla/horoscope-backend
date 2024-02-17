import { Request, Response } from "express";
import ContactModel, { Contact } from "../models/contactModel";
import authModal from "../models/authModal";
import axios from "axios";
import { prisma } from "..";

class ContactController {
  public async createContact(req: Request, res: Response): Promise<void> {
    try {
      const existingContact = await prisma.contacts.findUnique({
        where: { mobile_number: req.body.mobile_number },
      });
      if (existingContact) {
        res.status(200).json({
          message: "Contact already created!",
          contact: existingContact,
        });
        return;
      }
      const newContact = await prisma.contacts.create({ data: req.body });
      const auth = await prisma.auths.findFirst({});

      const accessToken = auth?.accessToken;

      const contactData = {
        names: [
          {
            givenName: `${newContact.name ?? "-"}`,
          },
        ],
        phoneNumbers: [
          {
            value: newContact.mobile_number,
            type: "Mobile Number",
          },
          {
            type: "WhatsApp Number",
            value: newContact.whatsapp_number,
          },
        ],
        birthdays: [
          {
            date: {
              day: ((newContact?.dob?.getDate() ?? 0) % 31) + 1, // Ensure day remains within the range 1-31
              month: (((newContact?.dob?.getMonth() ?? 0) + 1) % 12) + 1, // Ensure month remains within the range 1-12
              year: (newContact?.dob?.getFullYear() ?? 0) + 1,
            },
          },
        ],
        addresses: [
          {
            type: "Birth of Place",
            city: newContact?.place_of_birth?.description,
          },
        ],
        genders: [
          {
            value: newContact?.gender,
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
        contact: newContact,
      });

      return;
    } catch (error: any) {
      console.log(error.message);
      res
        .status(500)
        .json({ error: error.message, message:  "Error creating contact" });
    }
  }

  public async getAllContact(req: Request, res: Response): Promise<void> {
    try {
      const contact = await prisma.contacts.findMany();
      res.status(200).json(contact);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error retrieving contact" });
    }
  }

  public async getContact(req: Request, res: Response): Promise<void> {
    try {
      const contact = await prisma.contacts.findUnique({
        where: { id: req.params.id },
      });

      res.status(200).json(contact);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving contact" });
    }
  }

  public async updateContact(req: Request, res: Response): Promise<void> {
    try {
      const updatedContact = await prisma.contacts.update({
        where: { id: req.params.id },
        data: {
          ...req.body,
          updatedAt: new Date(),
        },
      });
      res.status(200).json({ message: "Contact updated", updatedContact });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error updating contact" });
    }
  }

  public async deleteContact(req: Request, res: Response): Promise<void> {
    try {
      await prisma.contacts.delete({
        where: { id: req.params.id },
      });
      res.status(204).json({
        message: "Contact Deleted",
      });
    } catch (error) {
      res.status(500).json({ error: "Error deleting contact" });
    }
  }

  public async getNewContacts(request: Request, response: Response) {
    try {
      const nonFetchedContacts = await prisma.contacts.findMany({
        where: { last_fetched: null },
      });

      await prisma.$transaction(async (tx) => {
        for (const contact of nonFetchedContacts) {
          await tx.contacts.update({
            where: { id: contact.id },
            data: { last_fetched: new Date() },
          });
        }
      });

      response.status(200).json({
        message: "Contact retrieved successfully",
        contact: nonFetchedContacts,
      });
    } catch (error: any) {
      console.error("Error fetching new contacts:", error);
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
