import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

export async function fetchPrices(req, res) {
    try {
        const { symbol } = req.body;
        const url = `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD`;
        const result = await axios.get(url, {
            headers: {
                "Authorization": `Bearer ${process.env.CRYPTOCOMPARE_API_KEY}`
            }
        })
        res.status(200).json({ success: true, price: result.data.USD });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, errorMessage: 'An unexpected error occurred' });
    }
}