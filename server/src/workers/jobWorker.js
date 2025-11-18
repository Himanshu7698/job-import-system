require("dotenv").config();
const ImportLog = require("../models/ImportLog");
const Job = require("../models/Job");
const createJobQueue = require("../queues/jobQueue");
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Worker DB Connected"))
  .catch((err) => console.log("DB Error:", err));

const queue = createJobQueue({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
});

let initSocketCall = undefined;
const callSocket = () => {
  clearTimeout(initSocketCall);
  initSocketCall = setTimeout(() => {
    if (global.io) global.io.emit("refetch", { refetch: true });
  }, 5000);
};

queue.process(async (job) => {
  const { item, source, id } = job.data;

  const jobId = item.id || item.guid?._ || item.guid;

  if (!jobId) {
    console.log("❌ No job ID found, skipping");
    return;
  }

  const importLog = await ImportLog.findById(id);

  const exists = await Job.findOne({ jobId });

  if (exists) {
    await Job.updateOne(
      { jobId },
      {
        title: item.title,
        description: item.description || item["content:encoded"],
        company: item["job_listing:company"],
        location: item["job_listing:location"],
        link: item.link,
        pubDate: item.pubDate,
        rawData: item,
      }
    );
    importLog.totalImported = importLog.totalImported + 1;
    importLog.updatedJobs = importLog.updatedJobs + 1;
    await importLog.save();
    callSocket();
    console.log("🔁 Updated job:", jobId);
    return "updated";
  }

  await Job.create({
    jobId,
    title: item.title,
    description: item.description || item["content:encoded"],
    company: item["job_listing:company"],
    location: item["job_listing:location"],
    link: item.link,
    pubDate: item.pubDate,
    rawData: item,
  });

  importLog.totalImported = importLog.totalImported + 1;
  importLog.newJobs = importLog.newJobs + 1;
  await importLog.save();
  callSocket();
  console.log("🆕 Inserted new job:", jobId);
  return "new";
});
