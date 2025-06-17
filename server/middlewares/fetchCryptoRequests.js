import { CryptoRequest } from "../models/cryptoRequests.js";

export default async function fetchCryptoRequests(req, res) {
    try {
        const cryptoRequests = await CryptoRequest.find({ donor: req.session._address });
        res.status(200).json({ success: true, data: cryptoRequests ? cryptoRequests : [] });
    } catch(e) {
        console.error(e);
        res.status(500).json({ success: false, errorMessage: 'ERROR: 500. Failed to fetch crypto requests' });
    }
}