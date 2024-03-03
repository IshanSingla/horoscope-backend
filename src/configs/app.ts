import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import expressSession from "express-session";
import morgan from "morgan";
import dotenv from "dotenv";
import { passport } from "./passport"


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

export {app}