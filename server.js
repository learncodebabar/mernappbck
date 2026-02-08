require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const Owner = require("./models/Owner");

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// STARTUP CHECK: Verify Owner Exists
// ============================================
const checkOwnerOnStartup = async () => {
  try {
    const owner = await Owner.findOne({});
    if (owner) {
      console.log("✅ Owner exists:", owner.email);
    } else {
      console.log("⚠️  No owner registered yet. Please register an owner.");
    }
  } catch (err) {
    console.error("❌ Error checking owner:", err.message);
  }
};

// Run check after DB connection
checkOwnerOnStartup();

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/sales", require("./routes/salesRoutes"));
app.use("/api/shop-settings", require("./routes/shopSettings"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/employees", require("./routes/employees"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/locations", require("./routes/locations"));

app.get("/", (req, res) => {
  res.send("Shop Management Backend Running");
});
console.log("Database URL:", process.env.MONGO_URI ? "Connected" : "MISSING!");
console.log("JWT Secret:", process.env.JWT_SECRET ? "Set" : "MISSING!");
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
