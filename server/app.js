import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from 'cors';
const app = express();
import { HomeRouter } from "./routes/home.js";
import { FeaturesRouter } from "./routes/features.js"
import { ConnectRouter } from './routes/connect.js'
import { ChatsRouter } from './routes/chats.js';
import path from "path";
import dbConnect from "./utils/db_connection.js";
import { sessionParser } from "./middlewares/session.js";
import cloudinary from 'cloudinary';

dbConnect(); // Database connection

cloudinary.v2.config({ // Cloudinary configuration
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.use(cors({ origin: "http://localhost:5173" })); // Allows request from vite dev server
// Remove the code above before pushing to prod

app.use(express.static(path.resolve('dist')));

app.use(sessionParser);  

// Add functionality that disconnects wallet
// if session is cleared or expired;

// Attaches user's address to request object if session has been set
app.use((req, res, next) => {
    if(req.session && req.session._address) {
        req.address = req.session._address;
        next()
    } else {
        next();
    }
})

app.use(express.json());

app.use(HomeRouter);
app.use(FeaturesRouter);
app.use(ConnectRouter);
app.use(ChatsRouter);

export const server = app.listen(3000, () => {
    console.log('Server is active');
})