require('dotenv').config();
const cron = require('node-cron');
const mongoose = require("mongoose");
const { fetchFeed, extractItemsFromFeed } = require('../services/fetchFeeds');
const createJobQueue = require('../queues/jobQueue');
const ImportLog = require('../models/ImportLog');

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ DB Error:", err));

// Redis Queue
const queue = createJobQueue({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASS || ''
});

// Add ALL URLs here
const FEED_URLS = [
  "https://jobicy.com/?feed=job_feed",
  "https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time",
  "https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france",
  "https://jobicy.com/?feed=job_feed&job_categories=design-multi media",
  "https://jobicy.com/?feed=job_feed&job_categories=data-science",
  "https://jobicy.com/?feed=job_feed&job_categories=copywriting",
  "https://jobicy.com/?feed=job_feed&job_categories=business",
  "https://jobicy.com/?feed=job_feed&job_categories=management",
  "https://www.higheredjobs.com/rss/articleFeed.cfm"
];

async function runImportForUrl(url) {
  try {
    const parsed = await fetchFeed(url);
    const items = extractItemsFromFeed(parsed);

    const importLog = new ImportLog({
      fileName: url,
      totalFetched: items.length,
      totalImported: 0,
      newJobs: 0,
      updatedJobs: 0,
      failedJobs: []
    });
    await importLog.save();

    let TotalQueue = 0;

    for (const item of items) {
      try {
        await queue.add({ item, source: url, id: importLog._id });
        TotalQueue++;
      } catch (err) {
        importLog.failedJobs.push({ item, reason: err.message });
      }
    }

    await importLog.save();

    console.log(`✔ Completed: ${url} | Total Queue ${TotalQueue}`);
  } catch (err) {
    console.error(`❌ URL Failed ${url}:`, err);
  }
}

cron.schedule("0 * * * *", async () => {
  console.log("⏳ Cron Triggered");
  for (const url of FEED_URLS) {
    await runImportForUrl(url);
  }

  console.log("✅ Cron Finished");
});
