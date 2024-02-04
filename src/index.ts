import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import callRoutes from "./routes/callRoutes";
import contactRoutes from "./routes/contactRoutes";

const app = express();
const port = process.env.PORT || 3000;
const mongoURI =
  "mongodb+srv://bizzyka:w94htX4kekYfuWkH@internal.18brhl0.mongodb.net/";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "production",
} as mongoose.ConnectOptions);

app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.get("/region", (req, res) => {
  res.send(`I am an Edge Function! (executed on ${process.env.VERCEL_REGION})`,);
}
);

app.use("/api/phone", callRoutes);
app.use("/api/contact", contactRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
