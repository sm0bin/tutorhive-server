const Service = require('../models/Service');

exports.getAllServices = async (req, res) => {
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
};

exports.getService = async (req, res) => {
    try {
        const id = req.params.id;
        console.log('hitting:', id, 'service-cont');
        const result = await Service.findById(id).lean().exec();
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

exports.createService = async (req, res) => {
    try {
        const newService = req.body;
        const result = await Service.create(newService);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Service.findByIdAndDelete(id).lean().exec();
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

exports.updateService = async (req, res) => {
    try {
        const id = req.params.id;
        const updateService = req.body;
        const result = await Service.findByIdAndUpdate(id, updateService, { new: true }).lean().exec();
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};