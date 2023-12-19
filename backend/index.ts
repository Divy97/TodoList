
import express from 'express';
import mongoose  from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/auth';
import todoRoutes from './routes/todo';


const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/todo", todoRoutes);

require('dotenv').config();

if (!process.env.MONGO_URL) {
  console.error('MONGO_URL is not defined in the environment variables');
  process.exit(1); 
}

mongoose.connect(process.env.MONGO_URL, {dbName:'courses'});

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
