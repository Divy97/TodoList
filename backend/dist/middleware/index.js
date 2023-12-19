"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!process.env.SECRET) {
        console.error("SECRET is not defined in the environment variables");
        process.exit(1);
    }
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jsonwebtoken_1.default.verify(token, process.env.SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            if (!user) {
                return res.status(403);
            }
            if (typeof user === "string") {
                return res.status(403);
            }
            req.headers['userId'] = user.id;
            next();
        });
    }
    else {
        res.sendStatus(401);
    }
};
exports.authenticateJWT = authenticateJWT;
