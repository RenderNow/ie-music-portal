const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const OC_API_KEY = "7a3bafe2-6978-4f76-8960-b9a8406fe665"; // 🔹 Replace with your actual API Key

app.post("/api/user-achievements", async (req, res) => {
    const { userOcId } = req.body;

    if (!userOcId) {
        return res.status(400).json({ error: "User OCID is required" });
    }

    try {
        console.log(`🔹 Fetching achievements for user: ${userOcId}`);

        const response = await axios.get(
            `https://api.vc.staging.opencampus.xyz/admin/vc/${userOcId}`,
            { headers: { "X-API-KEY": OC_API_KEY } }
        );

        console.log("✅ Open Campus API Response:", response.data);

        if (!response.data) {
            return res.status(404).json({ error: "No achievements found" });
        }

        res.json({ achievements: response.data });
    } catch (error) {
        console.error("❌ Open Campus API Error:", error.response?.data || error.message);

        // ✅ Log full error details
        if (error.response) {
            console.error("🔴 Full Error Response:", error.response.status, error.response.statusText, error.response.data);
        } else {
            console.error("🔴 No response received from Open Campus API.");
        }

        res.status(500).json({
            error: "Failed to fetch achievements",
            details: error.response?.data || error.message,
        });
    }
});

const port = process.env.PORT || 3000; // Fallback to 3000 for local development
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
