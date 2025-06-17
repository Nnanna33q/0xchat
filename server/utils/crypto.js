import dotenv from 'dotenv';
dotenv.config();
import { randomBytes, createCipheriv, createDecipheriv} from 'crypto'

export function encrypt (message) {
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes256', Buffer.alloc(32, process.env.SECRET_KEY), iv);
    const encryptedMessage = cipher.update(message, 'utf-8', 'base64') + cipher.final('base64');
    return {
        encryptedMessage: encryptedMessage,
        iv: iv.toString('base64') // Converts to base64 for easier db storage
    }
}

export function decrypt (encryptedMessage, iv) {
    const decipher = createDecipheriv('aes256', Buffer.alloc(32, process.env.SECRET_KEY), Buffer.from(iv, 'base64'));
    const data = decipher.update(encryptedMessage, 'base64', 'utf-8') + decipher.final('utf-8');
    return data;
}