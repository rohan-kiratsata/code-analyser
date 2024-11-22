require('dotenv').config();
const express = require("express");
const cors = require("cors");
const analyzeRepo = require("./analyzeRepo");

const app = express();
const port = process.env.PORT || 5001;

// Configure CORS with specific options
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.post("/analyze", async (req, res) => {
  const { repoUrl } = req.body;
  try {
    const analysis = await analyzeRepo(repoUrl);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
