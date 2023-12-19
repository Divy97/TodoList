import express from "express";
import jwt from "jsonwebtoken";
import {z} from 'zod';

import { authenticateJWT } from "../middleware/index";
import { User } from "../db";

const router = express.Router();

const userInput = z.object({
  username: z.string().min(1).max(10),
  password: z.string().min(6).max(20)
})

router.post("/signup", async (req, res) => {
  if(!process.env.SECRET) {
    console.error('SECRET is not defined in the environment variables');
    process.exit(1); 
  }

  let parsedInput = userInput.safeParse(req.body);
  if(!parsedInput.success) {
    return res.status(411).json({
      "message":"Invalid Input"
    })
  }
  
  if(typeof parsedInput.data.username !== "string") {
    res.status(411).json({
      "message":"Wrong input type"
    })
    return;
  }

  const user = await User.findOne({ username: parsedInput.data.username });
  if (user) {
    res.status(401).json({
      message: "User Already Exists",
    });
  } else {
    const newUser = new User({
      username: parsedInput.data.username,
      password: parsedInput.data.password,
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.SECRET, { expiresIn: "1h" });
    res.json({ message: "User created successfully", token });
  }
});

router.post("/login", async (req, res) => {
  if(!process.env.SECRET) {
    console.error('SECRET is not defined in the environment variables');
    process.exit(1); 
  }
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: "1h" });
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Invalid username or password" });
  }
});

router.get("/me", authenticateJWT, async (req, res) => {
  const userId = req.headers['userId'];
  
  const user = await User.findOne({ _id: userId });
  if (user) {
    res.json({ username: user.username });
  } else {
    res.status(403).json({ message: "User not logged in" });
  }
});

export default router;
