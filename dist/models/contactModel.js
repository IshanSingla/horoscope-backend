"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ContactSchema = new mongoose_1.Schema({
    name: {
        type: String,
        require: false,
    },
    mobile_number: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /\d{10}/.test(v);
            },
            message: (props) => `${props.value} is not a valid mobile number!`,
        },
    },
    whatsapp_number: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /\d{10}/.test(v);
            },
            message: (props) => `${props.value} is not a valid mobile number!`,
        },
    },
    gender: {
        type: String,
        required: false,
    },
    dob: { type: Date },
    place_of_birth: {
        description: { type: String },
        latitude: { type: Number },
        longitude: { type: Number },
    },
    series_number: {
        type: Number,
        required: true,
        default: 0,
    },
    last_fetched: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Contact", ContactSchema);
