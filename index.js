const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./src/config/db');
const cookieParser = require('cookie-parser');
const bookingRoutes = require('./src/routes/bookingRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const faqRoutes = require('./src/routes/faqRoutes');
const authRoutes = require('./src/routes/authRoutes');
require('dotenv').config();

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://tutorhive-sm.web.app',
        'https://tutorhive-sm.firebaseapp.com'
    ],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/bookings', bookingRoutes);
app.use('/services', serviceRoutes);
app.use('/faqs', faqRoutes);
app.use('/auth', authRoutes);
app.use('/', (req, res) => {
    res.send("TutorHive Server is running...");
})

// Server`
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));