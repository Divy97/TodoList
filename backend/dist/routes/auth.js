"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const index_1 = require("../middleware/index");
const db_1 = require("../db");
const router = express_1.default.Router();
let userInput = zod_1.z.object({
    username: zod_1.z.string().min(1),
    password: zod_1.z.string().min(1)
});
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.SECRET) {
        console.error('SECRET is not defined in the environment variables');
        process.exit(1);
    }
    let parsedInput = userInput.safeParse(req.body);
    if (!parsedInput.success) {
        return res.status(411).json({
            "message": "Invalid Innnnnnnnnnnnnnnnnput"
        });
    }
    if (typeof parsedInput.data.username !== "string") {
        res.status(411).json({
            "message": "Wrong input type"
        });
        return;
    }
    const user = yield db_1.User.findOne({ username: parsedInput.data.username });
    if (user) {
        res.status(401).json({
            message: "User Already Exists",
        });
    }
    else {
        const newUser = new db_1.User({
            username: parsedInput.data.username,
            password: parsedInput.data.password,
        });
        yield newUser.save();
        const token = jsonwebtoken_1.default.sign({ id: newUser._id }, process.env.SECRET, { expiresIn: "1h" });
        res.json({ message: "User created successfully", token });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.SECRET) {
        console.error('SECRET is not defined in the environment variables');
        process.exit(1);
    }
    const { username, password } = req.body;
    const user = yield db_1.User.findOne({ username, password });
    if (user) {
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.SECRET, { expiresIn: "1h" });
        res.json({ message: "Logged in successfully", token });
    }
    else {
        res.status(403).json({ message: "Invalid username or password" });
    }
}));
router.get("/me", index_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers['userId'];
    const user = yield db_1.User.findOne({ _id: userId });
    if (user) {
        res.json({ username: user.username });
    }
    else {
        res.status(403).json({ message: "User not logged in" });
    }
}));
exports.default = router;
