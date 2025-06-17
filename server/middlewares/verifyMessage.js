import { SiweMessage } from "siwe";

export default async function verifyMessage(req, res, next) {
    try {
        // Verify Message
        const { message, signature, address } = req.body;
        const siwe = await new SiweMessage(message).verify({ signature: signature });
        if (!siwe.success) {
            // Unsuccessful message verification
            throw 'Failed to verify message'
        }
        next();
    } catch (e) {
        console.error(e);
        res.status(400).json({ success: false, errorMessage: 'Failed to verify message' });
    }
}