import { User } from "../models/userModel.js";

// This function sets the session and saves user's address to db if not already saved
export default async function userCreation(req, res) {
    try {
        const { address } = req.body;
        if(address.length === 42 && address[0] === '0' && address[1] === 'x') {
            const user = await User.findOne({ address: address });
            if(!user) {
                await new User({
                    address: address,
                    registrationDate: Date.now(),
                    lastLogin: Date.now()
                }).save()
            }
            req.session._address = address;
            res.status(200).json({ success: true });
        } else {
            res.status(400).json({ success: false, errorMessage: 'Invalid evm address' });
        }
    } catch(e) {
        console.error(e);
        res.status(500).json({ success: false, errorMessage: 'Failed to create new user' });
    }
}