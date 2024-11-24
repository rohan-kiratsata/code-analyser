const express = require("express");
const cors = require("cors");
const analyzeRepo = require("./analyzeRepo");

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
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
