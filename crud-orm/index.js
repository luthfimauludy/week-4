const express = require("express");
const dotenv = require("dotenv");

// Import routes
const Event = require("./server/api/event");
const City = require("./server/api/city");
const Category = require("./server/api/category");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route middlewares
app.use("/api", Event);
app.use("/api", City);
app.use("/api", Category);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
