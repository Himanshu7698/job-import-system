const express = require('express');
const router = express.Router();
const createJobQueue = require('../queues/jobQueue');
const { fetchFeed, extractItemsFromFeed } = require('../services/fetchFeeds');
const ImportLog = require('../models/ImportLog');

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const queue = createJobQueue({ host: REDIS_HOST, port: REDIS_PORT });

async function runImportForUrl(url) {
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

    let totalImported = 0;

    const enqueuePromises = items.map(async (it) => {
        try {
            await queue.add({ item: it, source: url });
            totalImported++;
        } catch (err) {
            importLog.failedJobs.push({ item: it, reason: String(err) });
        }
    });

    await Promise.all(enqueuePromises);

    importLog.totalImported = totalImported;
    await importLog.save();

    return importLog;
}

/* ============================
   POST /imports/run (single)
============================ */
router.post('/run', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'url required' });

    try {
        const log = await runImportForUrl(url);
        res.json({ ok: true, log });
    } catch (err) {
        console.error('Import run error', err);
        res.status(500).json({ ok: false, error: String(err) });
    }
});

/* =================================
   POST /imports/run-multiple
================================= */
router.post('/run-multiple', async (req, res) => {
    const { urls } = req.body;

    if (!Array.isArray(urls) || urls.length === 0) {
        return res.status(400).json({ error: 'urls[] required' });
    }

    try {
        const results = [];
        for (const u of urls) {
            const log = await runImportForUrl(u);
            results.push(log);
        }

        return res.json({ ok: true, results });
    } catch (err) {
        console.error('Import multiple error', err);
        return res.status(500).json({ ok: false, error: String(err) });
    }
});

module.exports = router;
