import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

export default async function dbConnect() {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log('Connected to db');
    } catch (e) {
        console.log(`Failed to connect to mongodb database`);
        console.error(e);
        process.exit(1);
    }
}

