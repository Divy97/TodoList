"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const todo_1 = __importDefault(require("./routes/todo"));
const app = (0, express_1.default)();
const port = 8080;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/auth", auth_1.default);
app.use("/todo", todo_1.default);
require('dotenv').config();
if (!process.env.MONGO_URL) {
    console.error('MONGO_URL is not defined in the environment variables');
    process.exit(1);
}
mongoose_1.default.connect(process.env.MONGO_URL, { dbName: 'courses' });
const db = mongoose_1.default.connection;
db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});
db.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
});
