import callRoutes from "./routes/callRoutes";
import contactRoutes from "./routes/contactRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swaggerDocument.json";
import { passport } from "./configs/passport"
import { app } from "./configs/app";


const port = process.env.PORT || 3000;

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
  res.send(
    `I am an Edge Function! (executed on ${process.env.VERCEL_REGION})`
  );
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/ivr", callRoutes);
app.use("/api/contact", contactRoutes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
