import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import callRoutes from "./routes/callRoutes";
import contactRoutes from "./routes/contactRoutes";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swaggerDocument.json";
import passport from "passport";
import expressSession from "express-session";
import contactModel from "./models/contactModel";
import morgan from "morgan";
import { initializePassport } from "./middleware/passport";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
dotenv.config();
app.use(
  cors({
    origin: false,
  })
);
app.use(morgan("dev"));
app.use(
  expressSession({
    secret: "ishan",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

initializePassport(passport);

const port = process.env.PORT || 3000;
const mongoURI =
  "mongodb+srv://bizzyka:w94htX4kekYfuWkH@internal.18brhl0.mongodb.net/";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "production",
} as mongoose.ConnectOptions);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get(
  "/login",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "openid",
      "https://www.googleapis.com/auth/contacts",
    ],
  })
);

app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  }
);

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.get("/region", (req, res) => {
  res.send(`I am an Edge Function! (executed on ${process.env.VERCEL_REGION})`);
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/call", callRoutes);
app.use("/api/contact", contactRoutes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export { prisma };
