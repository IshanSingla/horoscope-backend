"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const personModel_1 = __importDefault(require("../models/personModel"));
class PersonController {
    async createPerson(req, res) {
        try {
            const person = new personModel_1.default(req.body);
            const savedPerson = await person.save();
            res.status(201).json(savedPerson);
        }
        catch (error) {
            res.status(500).json({ error: "Error creating person" });
        }
    }
    async getAllPerson(req, res) {
        try {
            const person = await personModel_1.default.find();
            res.status(200).json(person);
        }
        catch (error) {
            res.status(500).json({ error: "Error retrieving person" });
        }
    }
    async getPerson(req, res) {
        try {
            const person = await personModel_1.default.findOne({ _id: req.params.id });
            res.status(200).json(person);
        }
        catch (error) {
            res.status(500).json({ error: "Error retrieving person" });
        }
    }
    async updatePerson(req, res) {
        try {
            const updatedPerson = await personModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            });
            res.status(200).json(updatedPerson);
        }
        catch (error) {
            res.status(500).json({ error: "Error updating person" });
        }
    }
    async deletePerson(req, res) {
        try {
            await personModel_1.default.findByIdAndDelete(req.params.id);
            res.status(204).json();
        }
        catch (error) {
            res.status(500).json({ error: "Error deleting person" });
        }
    }
}
exports.default = new PersonController();
