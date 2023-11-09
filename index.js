const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5500;
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const ObjectId = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// Middleware
app.use(cors({
    origin: [
        // 'http://localhost:5173',
        'https://tuition-master-sm.web.app',
        'https://tuition-master-sm.firebaseapp.com/'
    ],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.olrpvxs.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


const verifyToken = (req, res, next) => {
    const token = req?.cookies?.token;
    // console.log("token", token);
    if (!token) {
        return res.status(401).send({ message: "Access Denied" });
    }

    jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(401).send({ message: "Access Denied" });
        }
        req.user = decoded;
        next();
        // console.log("user", user);
    })
}



async function run() {
    try {
        await client.connect();

        const database = client.db("tuitionMasterDB");
        const services = database.collection("services");
        const bookings = database.collection("bookings");

        app.post("/jwt", async (req, res) => {
            const user = req.body;
            console.log(user);
            const token = jwt.sign(user, process.env.SECRET_TOKEN, { expiresIn: '1h' });
            res.cookie('token', token,
                {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none'
                })
                .send({ success: true })
        })

        app.post("/logout", async (req, res) => {
            const user = req.body;
            console.log("logout", user);
            res.clearCookie('token', { maxAge: 0 }).send({ success: true })
        })

        app.get("/services", async (req, res) => {
            if (req.query?.email) {
                console.log(req.query);
                const query = { "serviceProvider.email": req.query.email };
                const result = await services.find(query).toArray();
                res.send(result);
            } else if (req.query?.search) {
                const searchText = req.query.search;
                const query = {
                    serviceName: { $regex: searchText, $options: "i" }
                }
                const options = {
                    sort: {
                        servicePrice: req.query.sort === "asc" ? 1 : -1
                    }
                }
                const result = await services.find(query, options).toArray();
                res.send(result);
            } else {
                const result = await services.find().toArray();
                res.send(result);
            }
        });


        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await services.findOne(query);
            res.send(result);
        })

        app.delete("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await services.deleteOne(query);
            res.send(result);
        })

        app.post("/services", async (req, res) => {
            const newService = req.body;
            const result = await services.insertOne(newService);
            console.log(result);
            res.json(result);
        })

        app.put("/services/:id", async (req, res) => {
            const filter = { _id: new ObjectId(req.params.id) };
            const options = { upsert: true };
            const updateService = req.body;
            const service = {
                $set: {
                    serviceImage: updateService.serviceImage,
                    serviceName: updateService.serviceName,
                    servicePrice: updateService.servicePrice,
                    serviceArea: updateService.serviceArea,
                    serviceDescription: updateService.serviceDescription,
                },
            };
            const result = await services.updateOne(filter, service, options);
            res.send(result);
        })


        app.get("/bookings", verifyToken, async (req, res) => {
            console.log("cookies", req.cookies);
            if (req.query.email !== req.user.email) {
                return res.status(401).send({ message: "Access Denied" });
            }
            if (req.query?.email) {
                const query1 = { "serviceProvider.email": req.query.email };
                const userPending = await bookings.find(query1).toArray();
                const query2 = { "serviceUser.email": req.query.email };
                const userBooking = await bookings.find(query2).toArray();
                res.send({ userPending, userBooking });
            } else {
                const result = await bookings.find().toArray();
                res.send(result);
            }
        })


        app.post("/bookings", async (req, res) => {
            const newBooking = req.body;
            const result = await bookings.insertOne(newBooking);
            console.log(result);
            res.json(result);
        })

        app.put("/bookings/:id", async (req, res) => {
            const filter = { _id: new ObjectId(req.params.id) };
            // const options = { upsert: true };
            const updateState = req.body.serviceState;
            console.log(updateState);
            const booking = {
                $set: {
                    "serviceDetails.state": updateState,
                },
            };
            const result = await bookings.updateOne(filter, booking);
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Tuition Master Server is Running...')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

