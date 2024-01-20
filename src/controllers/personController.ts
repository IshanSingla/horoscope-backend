import { Request, Response } from "express";
import PersonModel, { Person } from "../models/personModel";

class PersonController {
  public async createPerson(req: Request, res: Response): Promise<void> {
    try {
      const person = new PersonModel(req.body);
      const savedPerson = await person.save();
      res.status(201).json(savedPerson);
    } catch (error) {
      res.status(500).json({ error: "Error creating person" });
    }
  }

  public async getAllPerson(req: Request, res: Response): Promise<void> {
    try {
      const person = await PersonModel.find();
      res.status(200).json(person);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving person" });
    }
  }

  public async getPerson(req: Request, res: Response): Promise<void> {
    try {
      const person = await PersonModel.findOne({ _id: req.params.id });
      res.status(200).json(person);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving person" });
    }
  }

  public async updatePerson(req: Request, res: Response): Promise<void> {
    try {
      const updatedPerson = await PersonModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      res.status(200).json(updatedPerson);
    } catch (error) {
      res.status(500).json({ error: "Error updating person" });
    }
  }

  public async deletePerson(req: Request, res: Response): Promise<void> {
    try {
      await PersonModel.findByIdAndDelete(req.params.id);
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ error: "Error deleting person" });
    }
  }
}

export default new PersonController();
