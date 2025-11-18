const Job = require("../models/Job");

exports.getJobs = async (req, res) => {
    try {
        const search = req.query.search || "";
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        const skip = (page - 1) * limit;

        // Search condition
        const condition = search
            ? {
                $or: [
                    { jobId: { $regex: search, $options: "i" } },
                    { title: { $regex: search, $options: "i" } },
                    { company: { $regex: search, $options: "i" } },
                    { location: { $regex: search, $options: "i" } }
                ]
            }
            : {};

        // Fetch data
        const [jobs, count] = await Promise.all([
            Job.find(condition)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            Job.countDocuments(condition)
        ]);

        res.status(200).json({
            status: "success",
            info: {
                count,
                current_page: page,
                limit,
                total_page: Math.ceil(count / limit),
            },
            data: jobs,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

// GET /api/jobs/:id
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ success: false, message: "Not found" });

        res.json({ success: true, data: job });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
