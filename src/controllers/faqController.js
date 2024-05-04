const Faq = require('../models/Faq');

exports.getAllFaqs = async (req, res) => {
    try {
        const result = await Faq.find().lean().exec();
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
}
