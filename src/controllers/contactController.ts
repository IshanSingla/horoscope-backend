import { Request, Response } from "express";
import axios from "axios";
import { prisma } from "../configs/prisma";

class ContactController {
  public async createContact(req: Request, res: Response): Promise<void> {
    try {
      const existingContact = await prisma.contacts.findUnique({
        where: { mobile_number: req.body.mobile_number },
      });
      if (existingContact) {
        res.status(400).send("Already Created");
        return;
      }
      const newContact = await prisma.contacts.create({
        data: {
          mobile_number: req.body.mobile_number,
          createdAt: new Date(),
          updatedAt: new Date(),
          dob: new Date(req.body.dob),
          series_number: req.body.series_number,
          whatsapp_number: req.body.whatsapp_number,
          pob_description: req.body.pob_description,
          pob_latitude: req.body.pob_latitude,
          pob_longitude: req.body.pob_longitude,
          gender: req.body.gender,
          // last_fetched: new Date(),
          name: req.body.name,
        },
      });
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
        // birthdays: [
        //   {
        //     date: {
        //       day: ((newContact?.dob?.getDate() ?? 0) % 31) + 1, // Ensure day remains within the range 1-31
        //       month: (((newContact?.dob?.getMonth() ?? 0) + 1) % 12) + 1, // Ensure month remains within the range 1-12
        //       year: (newContact?.dob?.getFullYear() ?? 0) + 1,
        //     },
        //   },
        // ],
        addresses: [
          {
            type: "Birth of Place",
            city: newContact?.pob_description,
          },
        ],
        // genders: [
        //   {
        //     value: newContact?.gender,
        //   },
        // ],
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

      res.status(201).json(newContact);

      return;
    } catch (error: any) {
      console.log(error.message);
      res
        .status(500)
        .json({ error: error.message, message: "Error creating contact" });
    }
  }

  public async getContact(req: Request, res: Response): Promise<void> {
    try {
      let contact;
      const id = req.query.id as string;
      if (id === undefined) {
        contact = await prisma.contacts.findMany();
      } else {
        contact = await prisma.contacts.findUnique({
          where: { id: id },
        });
      }
      res.status(200).json(contact);
      return;
    } catch (error: any) {
      console.log(error.message);
      res.status(500).json({ error: "Error retrieving contact" });
    }
  }

  public async updateContact(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const updatedContact = await prisma.contacts.update({
        where: { id: id },
        data: {
          ...req.body,
          updatedAt: new Date(),
        },
      });
      res.status(200).json(updatedContact);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error updating contact" });
    }
  }

  public async deleteContact(req: Request, res: Response): Promise<void> {
    try {
      const id = req.query.id as string;
      await prisma.contacts.delete({
        where: { id: id },
      });
      res.status(200).json({
        message: "Contact Deleted",
      });
    } catch (error) {
      res.status(500).json({ error: "Error deleting contact" });
    }
  }

  public async getNewContacts(request: Request, response: Response) {
    try {
      let last_time = await prisma.last_fetched.findFirst();
      if (!last_time) {
        last_time = await prisma.last_fetched.create({
          data: {
            time: new Date(),
          },
        });
      }
      const last_fetched_contacts = await prisma.contacts.findMany({
        where: {
          createdAt: {
            gte: last_time.time,
          },
        },
      });

      await prisma.last_fetched.update({
        where: {
          id: last_time.id,
        },
        data: {
          time: new Date(),
        },
      });
      response.status(200).json(last_fetched_contacts);
    } catch (error: any) {
      console.error("Error fetching new contacts:", error);
      response.status(500).json({
        error: error.message || "Internal server error",
      });
    }
  }
}

export default new ContactController();
