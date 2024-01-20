"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phoneModel_1 = __importDefault(require("../models/phoneModel"));
class PhoneController {
    async createPhone(req, res) {
        try {
            const phone = new phoneModel_1.default(req.body);
            const savedPhone = await phone.save();
            res.status(201).json(savedPhone);
        }
        catch (error) {
            res.status(500).json({ error: "Error creating phone" });
        }
    }
    async getPhone(req, res) {
        try {
            const phone = await phoneModel_1.default.findOne({ _id: req.params.id });
            res.status(200).json(phone);
        }
        catch (error) {
            res.status(500).json({ error: "Error retrieving phone" });
        }
    }
    async updatePhone(req, res) {
        try {
            const updatedPhone = await phoneModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            });
            res.status(200).json(updatedPhone);
        }
        catch (error) {
            res.status(500).json({ error: "Error updating phone" });
        }
    }
    async deletePhone(req, res) {
        try {
            await phoneModel_1.default.findByIdAndDelete(req.params.id);
            res.status(204).json();
        }
        catch (error) {
            res.status(500).json({ error: "Error deleting phone" });
        }
    }
}
exports.default = new PhoneController();
