const express = require("express");
const router = express.Router();
const disk = require("diskusage");
const os = require("os");
const path = require("path");
const User = require("../models/User");

// GET /api/system/overview
router.get("/overview", async (req, res) => {
  try {
    // DB check
    let dbHealth = "unhealthy";
    try {
      await User.estimatedDocumentCount();
      dbHealth = "healthy";
    } catch {}

    // Active Sessions (users active in last 10 minutes)
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000);
    const activeSessions = await User.countDocuments({ lastActive: { $gte: tenMinAgo } });

    // Disk Usage
    const diskInfo = await disk.check(path.parse(__dirname).root);
    const used = (((diskInfo.total - diskInfo.free) / diskInfo.total) * 100).toFixed(2);

    res.json({
      serverStatus: "online",
      dbHealth,
      activeSessions,
      storageUsed: used
    });
  } catch (err) {
    console.error("System overview error:", err);
    res.status(500).json({ message: "Error fetching system overview" });
  }
});

module.exports = router;
