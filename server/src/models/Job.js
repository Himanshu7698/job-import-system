const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    jobId: String,
    title: String,
    description: String,
    company: String,
    location: String,
    link: String,
    pubDate: String,
    rawData: Object,
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
