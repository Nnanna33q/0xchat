import { CryptoRequest } from "../models/cryptoRequests.js";

export default async function declineRequest(req, res) {
    try {
        await CryptoRequest.deleteOne({ _id: req.body.id });
        res.status(200).json({ success: true });
    } catch(e) {
        console.error(e);
        res.status(500).json({ success: false, errorMessage: 'Failed to decline request' });
    }
}