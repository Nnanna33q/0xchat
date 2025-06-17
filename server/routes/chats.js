import express from 'express';
export const ChatsRouter = express.Router();
import path from 'path';
import multer from 'multer';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import fetchChatData from '../middlewares/fetchChatData.js';
import startChat from '../middlewares/startChat.js';
import validateMedia from '../middlewares/validateMedia.js';
import uploadMedia from '../middlewares/uploadMedia.js';
import { uploadAvatar } from '../middlewares/uploadMedia.js';
import { setOnlineStatusToFalse, setOnlineStatusToTrue } from '../middlewares/setOnlineStatus.js';
import { fetchAvatar } from '../middlewares/fetchChatData.js';
import { fetchPrices } from '../middlewares/fetchPrices.js';
import fetchCryptoRequests from '../middlewares/fetchCryptoRequests.js';
import declineRequest from '../middlewares/declineRequest.js';
import verifyRequest from '../middlewares/verifyRequest.js';

const upload = multer({ storage: multer.memoryStorage() });

ChatsRouter.get('/app/chats', isAuthenticated, (req, res) => {
    res.status(200).sendFile(path.resolve('dist/chats.html'))
})

// Retrieves user chat data
ChatsRouter.get('/app/chat-data', isAuthenticated, fetchChatData);

// Validates new chat recipient and starts conversation
ChatsRouter.post('/app/start-chat', isAuthenticated, startChat);

// Uploads file to cloudinary and responds with updated file's href url
ChatsRouter.post('/media/validate', isAuthenticated, upload.single('media'), validateMedia, uploadMedia);

// Uploads user's avatar to cloudinary
ChatsRouter.post('/app/upload/photo', isAuthenticated, upload.single('photo'), uploadAvatar)

// Sets user's friend's online status to false
ChatsRouter.post('/app/online/false', isAuthenticated, setOnlineStatusToFalse);

// Sets user's friend's online status to true;
ChatsRouter.post('/app/online/true', isAuthenticated, setOnlineStatusToTrue);

// Retrieves user's avatar
ChatsRouter.get('/app/avatar', isAuthenticated, fetchAvatar);

// Fetches asset prices
ChatsRouter.post('/app/price', isAuthenticated, fetchPrices);

// Fetches crypto requests
ChatsRouter.get('/app/crypto-requests', isAuthenticated, fetchCryptoRequests);

// Declines unwanted crypto requests (This endpoint is also called to delete crypto request on successful tx)
ChatsRouter.post('/app/decline', isAuthenticated, declineRequest);

//Verifies request by id
ChatsRouter.post('/app/verify-request', isAuthenticated, verifyRequest);