"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const contactModel_1 = __importDefault(require("../models/contactModel"));
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
            res.status(201).json({
                message: "Contact created successfully",
                contact: savedContact,
            });
            return;
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error creating contact" });
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
