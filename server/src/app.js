require('dotenv').config();
const express = require('express');
const bodyParser = require('express').json;
const importsRouter = require('./routes/imports');
const healthRouter = require('./routes/health');
const jobRoutes = require("./routes/jobRoutes");
const Http = require('http');
const { Server } = require("socket.io");
const cors = require("cors");
require("./cron/fetchCron");   // Import Cron (auto starts)
require("./workers/jobWorker"); // Import Worker (auto starts)

const app = express();
const PORT = process.env.PORT || 3000;

const server = Http.createServer(app);

global.io = new Server(server, {
    path: "/api/socket.io",
    cors: {
        origin: process.env.ORIGIN,
        methods: ["GET", "POST"],
        credentials: true
    },
});

app.use(bodyParser());
app.use(cors({ origin: "*" }));

app.use('/imports', importsRouter);
app.use('/health', healthRouter);
app.use("/api/jobs", jobRoutes);
require('./socket')(global.io);

server.listen(PORT, async () => {
    console.log(`🚀 Server started on http://localhost:${PORT}`);
});