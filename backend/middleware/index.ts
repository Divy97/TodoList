import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!process.env.SECRET) {
    console.error("SECRET is not defined in the environment variables");
    process.exit(1);
  }
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      if(!user) {
        return res.status(403);
      }
      if(typeof user === "string") {
        return res.status(403);
      }

      req.headers['userId'] = user.id;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
