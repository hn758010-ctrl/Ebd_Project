require("dotenv").config();
const express = require("express");
const connectDB = require("./db");

const app = express();

app.use(express.json());

// Health check (used by the course's automatic check)
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
