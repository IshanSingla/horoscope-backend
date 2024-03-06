"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passport = void 0;
const prisma_1 = require("./prisma");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport_1 = __importDefault(require("passport"));
exports.passport = passport_1.default;
passport_1.default.use(new GoogleStrategy({
    clientID: "377941489644-18up92381d1o35hv5nakjhv8637gv2v4.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:3000/google/callback",
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
    try {
        const lastAuth = await prisma_1.prisma.auths.findFirst({
            orderBy: [{ createdAt: "desc" }],
            take: 1,
        });
        const auth = await prisma_1.prisma.auths.upsert({
            where: {
                id: lastAuth?.id ?? "",
            },
            update: {
                accessToken,
                name,
                email,
                updatedAt: new Date(),
            },
            create: {
                accessToken,
                name,
                email,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
        return done(null, auth);
    }
    catch (error) {
        console.log(error);
        return done(null, null);
    }
}));
passport_1.default.serializeUser((contact, done) => {
    done(null, contact.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    const auth = await prisma_1.prisma.auths.findFirst();
    // authModal.findById(id);
    done(null, auth);
});
