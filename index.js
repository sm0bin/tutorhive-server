const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./src/config/db');
const cookieParser = require('cookie-parser');
const bookingRoutes = require('./src/routes/bookingRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const faqRoutes = require('./src/routes/faqRoutes');

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
app.use('/', (req, res) => {
    res.send("TutorHive Server is running...");
})



app.post("/jwt", async (req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.SECRET_TOKEN, { expiresIn: '1h' });
    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    }).send({ success: true });
});

app.post("/logout", async (req, res) => {
    const user = req.body;
    res.clearCookie('token', { maxAge: 0 }).send({ success: true });
});






// Bookings Routes
app.get("/bookings", verifyToken, async (req, res) => {
    try {
        if (req.query.email !== req.user.email) {
            return res.status(401).send({ message: "Access Denied" });
        }

        if (req.query?.email) {
            const query1 = { "serviceProvider.email": req.query.email };
            const userPending = await Booking.find(query1).lean().exec();
            const query2 = { "serviceUser.email": req.query.email };
            const userBooking = await Booking.find(query2).lean().exec();
            res.send({ userPending, userBooking });
        } else {
            const result = await Booking.find().lean().exec();
            res.send(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

app.post("/bookings", verifyToken, async (req, res) => {
    try {
        const newBooking = req.body;
        const result = await Booking.create(newBooking);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

app.put("/bookings/:id", verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const updateState = req.body.serviceState;
        const result = await Booking.findByIdAndUpdate(id, { "serviceDetails.state": updateState }, { new: true }).lean().exec();
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


app.get('/', (req, res) => {
    res.send('Tuition Master Server is Running...')
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
