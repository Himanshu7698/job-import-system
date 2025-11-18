const mongoose = require('mongoose');

const ImportLogSchema = new mongoose.Schema({
    fileName: String,
    timestamp: { type: Date, default: Date.now },
    totalFetched: Number,
    totalImported: Number,
    newJobs: Number,
    updatedJobs: Number,
    failedJobs: [
        {
            item: mongoose.Schema.Types.Mixed,
            reason: String,
        }
    ]
});


module.exports = mongoose.model('ImportLog', ImportLogSchema);