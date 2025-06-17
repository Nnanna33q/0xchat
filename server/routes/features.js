import express from 'express';
export const FeaturesRouter = express.Router();
import path from 'path';


FeaturesRouter.get('/features', (req, res) => {
    res.status(200).sendFile(path.resolve('dist/features.html'))
})