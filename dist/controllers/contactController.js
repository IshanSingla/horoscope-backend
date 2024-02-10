"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const contactModel_1 = __importDefault(require("../models/contactModel"));
const authModal_1 = __importDefault(require("../models/authModal"));
const axios_1 = __importDefault(require("axios"));
class ContactController {
    async createContact(req, res) {
        try {
            const contactExist = await contactModel_1.default.findOne({
                mobile_number: req.body.mobile_number,
            });
            if (contactExist) {
                res
                    .status(200)
                    .json({ message: "Contact already created!", contact: contactExist });
                return;
            }
            const contact = new contactModel_1.default(req.body);
            const savedContact = await contact.save();
            const auth = await authModal_1.default.findOne({});
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
                const response = await axios_1.default.post("https://people.googleapis.com/v1/people:createContact", contactData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                    params: {
                        sources: "READ_SOURCE_TYPE_CONTACT",
                        access_token: auth?.accessToken,
                        alt: "json",
                    },
                });
            }
            catch (error) {
                console.log(error?.response?.data);
            }
            res.status(201).json({
                message: "Contact created successfully",
                contact: savedContact,
            });
            return;
        }
        catch (error) {
            console.log(error.message);
            res
                .status(500)
                .json({ error: error.message || "Error creating contact" });
        }
    }
    async getAllContact(req, res) {
        try {
            const contact = await contactModel_1.default.find();
            res.status(200).json(contact);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error retrieving contact" });
        }
    }
    async getContact(req, res) {
        try {
            const contact = await contactModel_1.default.findOne({ _id: req.params.id });
            res.status(200).json(contact);
        }
        catch (error) {
            res.status(500).json({ error: "Error retrieving contact" });
        }
    }
    async updateContact(req, res) {
        try {
            const updatedContact = await contactModel_1.default.findByIdAndUpdate(req.params.id, { updatedAt: new Date(), ...req.body }, {
                new: true,
            });
            res.status(200).json({ message: "Contact updated", updatedContact });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error updating contact" });
        }
    }
    async deleteContact(req, res) {
        try {
            await contactModel_1.default.findByIdAndDelete(req.params.id);
            res.status(204).json({
                message: "Contact Deleted",
            });
        }
        catch (error) {
            res.status(500).json({ error: "Error deleting contact" });
        }
    }
    async getNewContacts(request, response) {
        try {
            const nonFetchedContacts = await contactModel_1.default.find({
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
        }
        catch (error) {
            response.status(500).json({
                error: error.message || "Internal server error",
            });
        }
    }
    async isMobileNumber(req, res) {
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
        }
        catch (error) {
            console.log(error.message);
            res.status(500).json({
                error: error.message,
            });
        }
    }
}
exports.default = new ContactController();
