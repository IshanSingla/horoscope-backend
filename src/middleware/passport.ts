import { PassportStatic } from "passport";
import authModal from "../models/authModal";
const GoogleStrategy = require("passport-google-oauth20").Strategy;

export function initializePassport(passport: PassportStatic): void {
  passport.use(
    new GoogleStrategy(
      {
        clientID:
          "377941489644-18up92381d1o35hv5nakjhv8637gv2v4.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "https://horoscope-backend.vercel.app/google/callback",
        scope: [
          "profile",
          "email",
          "openid",
          "https://www.googleapis.com/auth/contacts",
        ],
        accessType: "offline",
        approvalPrompt: "force",
      },
      async (
        accessToken: string,
        refreshToken: any,
        profile: any,
        done: any
      ) => {
        const { name, email } = profile._json;

        const auth = await authModal.findOneAndUpdate(
          {},
          { accessToken, refreshToken, name, email },
          {
            upsert: true,
            new: true,
          }
        );
        console.log(profile);
        console.log(refreshToken);
        return done(null, auth);
      }
    )
  );

  passport.serializeUser((contact: any, done: any) => {
    done(null, contact.id);
  });

  passport.deserializeUser(async (id, done) => {
    const auth = await authModal.findById(id);
    done(null, auth);
  });
}
