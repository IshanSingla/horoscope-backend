"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializePassport = void 0;
const authModal_1 = __importDefault(require("../models/authModal"));
const GoogleStrategy = require("passport-google-oauth20").Strategy;
function initializePassport(passport) {
    passport.use(new GoogleStrategy({
        clientID: "377941489644-18up92381d1o35hv5nakjhv8637gv2v4.apps.googleusercontent.com",
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
    }, async (accessToken, refreshToken, profile, done) => {
        const { name, email } = profile._json;
        const auth = await authModal_1.default.findOneAndUpdate({}, { accessToken, refreshToken, name, email }, {
            upsert: true,
            new: true,
        });
        console.log(profile);
        console.log(refreshToken);
        return done(null, auth);
    }));
    passport.serializeUser((contact, done) => {
        done(null, contact.id);
    });
    passport.deserializeUser(async (id, done) => {
        const auth = await authModal_1.default.findById(id);
        done(null, auth);
    });
}
exports.initializePassport = initializePassport;
