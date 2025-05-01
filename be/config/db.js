import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config({
    path: "../.env.local.be"
});

export default async function () {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
