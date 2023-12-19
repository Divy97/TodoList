import express from "express";
import {z} from 'zod';

import { authenticateJWT } from "../middleware/index";
import { Todo } from "../db";

const router = express.Router();

// interface TodoInput {
//   title: string,
//   description: string
// }

let todoInputProps = z.object({
  title: z.string().min(1),
  description: z.string().min(1)
})

router.post("/todos", authenticateJWT, (req, res) => {

  const parseInput = todoInputProps.safeParse(req.body);
  if(!parseInput.success) {
    return res.status(411).json({
      "message":"Invalid Input"
    })
  }
  const done = false;
  const userId = req.headers['userId'];

  const newTodo = new Todo({ title: parseInput.data.title, description: parseInput.data.description, done, userId });

  newTodo
    .save()
    .then((savedTodo) => {
      res.status(201).json(savedTodo);
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to create a new todo" });
    });
});

router.get("/todos", authenticateJWT, (req, res) => {
  const userId = req.headers["userId"];

  Todo.find({ userId })
    .then((todos) => {
      res.json(todos);
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to retrieve todos" });
    });
});

router.patch("/todos/:todoId/done", authenticateJWT, (req, res) => {
  const { todoId } = req.params;
  const userId = req.headers["userId"];

  Todo.findOneAndUpdate({ _id: todoId, userId }, { done: true }, { new: true })
    .then((updatedTodo) => {
      if (!updatedTodo) {
        return res.status(404).json({ error: "Todo not found" });
      }
      res.json(updatedTodo);
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to update todo" });
    });
});

export default router;
