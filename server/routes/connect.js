import express from 'express';
export const ConnectRouter = express.Router();
import path from 'path';
import { generateNonce, SiweMessage } from 'siwe';
import verifyMessage from '../middlewares/verifyMessage.js';
import userCreation from '../middlewares/userCreation.js';

ConnectRouter.get('/connect', (req, res) => {
    res.status(200).sendFile(path.resolve('dist/connect.html'))
})

ConnectRouter.get('/nonce', (req, res) => {
    // Sends nonce to FE
    res.status(200).json({ success: true, nonce: generateNonce() });
})

ConnectRouter.post('/verify', verifyMessage, userCreation) // Sets sessions too