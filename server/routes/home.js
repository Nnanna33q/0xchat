import express from 'express';
export const HomeRouter = express.Router();
import path from 'path';

HomeRouter.get('/', async (req, res) => {
    res.status(200).sendFile(path.resolve('dist/index.html'));
})