const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todo");

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/todo", todoRoutes);

require('dotenv').config();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});
