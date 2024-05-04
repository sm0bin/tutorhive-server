const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const faqSchema = new Schema({
    question: String,
    answer: String,
});

const Faq = mongoose.model('Faq', faqSchema);
module.exports = Faq;