import { CryptoRequest } from "../models/cryptoRequests.js";

export default async function verifyRequest(req, res) {
    try {
        const cryptoRequest = await CryptoRequest.findById(req.body.id);
        res.status(cryptoRequest ? 200 : 500).json({ success: cryptoRequest ? true : false, errorMessage: cryptoRequest ? '' : 'Invalid request id' });
    } catch(e) {
        console.error(e);
        res.status(500).json({ success: false, errorMessage: 'An unexpected error occurred' });
    }
}