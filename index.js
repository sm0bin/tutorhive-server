const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5500;
require("dotenv").config();
const ObjectId = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

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

// Connect
mongoose.connect(process.env.DB_URI)
    .then(() => { console.log("Connection successful.") })
    .catch((err) => { console.log(err.message) })


// {"_id":{"$oid":"654b6cf56d9189375963bdde"},"serviceId":"654a23f08eba517f34331011","serviceName":"Mathematics Tutoring","serviceImage":"https://source.unsplash.com/f1YfrZ1o2r8","serviceProvider":{"image":"https://source.unsplash.com/MTZTGvDsHFY","name":"John Doe","email":"john.doe@mail.com"},"servicePrice":{"$numberInt":"30"},"serviceArea":"New York, NY","serviceDescription":"Master math with our expert tutors. Personalized lessons to boost your math skills.","serviceUser":{"image":"https://source.unsplash.com/mens-gray-crew-neck-shirt-v2aKnjMbP_k/500x500","name":"Milon Kumar","email":"bitolew290@saturdata.com"},"serviceDetails":{"address":"SHRH, RU","startingDate":"November 8, 2023","status":"pending"}}



// Schema
const serviceSchema = new mongoose.Schema({
    serviceImage: String,
    serviceName: String,
    serviceDescription: String,
    serviceProvider: {
        image: String,
        name: String,
        email: String,
    },
    servicePrice: Number,
    serviceArea: String,
});

const bookingSchema = new mongoose.Schema({
    serviceId: String,
    serviceName: String,
    serviceImage: String,
    servicePrice: Number,
    serviceDescription: String,
    serviceArea: String,
    serviceProvider: {
        image: String,
        name: String,
        email: String,
    },
    serviceUser: {
        image: String,
        name: String,
        email: String,
    },
    serviceDetails: {
        address: String,
        startingDate: String,
        status: String,
    },
});


// Model
const Service = mongoose.model('Service', serviceSchema);
const Booking = mongoose.model('Booking', bookingSchema);


// Verify Token
const verifyToken = (req, res, next) => {
    const token = req?.cookies?.token;
    if (!token) {
        return res.status(401).send({ message: "Access Denied" });
    }

    jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Access Denied" });
        }
        req.user = decoded;
        next();
    });
};


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




// Services Routes
app.get("/services", async (req, res) => {
    try {
        if (req.query?.email) {
            const query = { "serviceProvider.email": req.query.email };
            const result = await Service.find(query).lean().exec();
            res.send(result);
        } else if (req.query?.search) {
            const searchText = req.query.search;
            const query = {
                serviceName: { $regex: searchText, $options: "i" }
            };
            const options = {
                sort: {
                    servicePrice: req.query.sort === "asc" ? 1 : -1
                }
            };
            const result = await Service.find(query, null, options).lean().exec();
            res.send(result);
        } else {
            const result = await Service.find().lean().exec();
            res.send(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

app.get("/services/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Service.findById(id).lean().exec();
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

app.post("/services", verifyToken, async (req, res) => {
    try {
        const newService = req.body;
        const result = await Service.create(newService);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

app.delete("/services/:id", verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Service.findByIdAndDelete(id).lean().exec();
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

app.put("/services/:id", verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const updateService = req.body;
        const result = await Service.findByIdAndUpdate(id, updateService, { new: true }).lean().exec();
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
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
