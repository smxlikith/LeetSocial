import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import contestRoutes from "./routes/contestRoutes.js"
import authRoutes from "./routes/authRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js"
import { ValidateRequestAuth } from "./middlewares/validateUser.js"

const app = express();
const connection = connectDB();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/user', ValidateRequestAuth, userRoutes);
app.use('/api/contest', ValidateRequestAuth, contestRoutes);
app.use('/api/notification', ValidateRequestAuth, notificationRoutes);
app.use((req, res) => {
    res.status(404).json({ error: 'API route not found' });
});

app.use((err, req, res, next) => {
    if (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
        return;
    }
    next();
})

export default app;