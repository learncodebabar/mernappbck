require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
// const Owner = require("./models/Owner");  //

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//  REMOVE OWNER CHECK - Not needed temporarily
// const checkOwnerOnStartup = async () => { ... };
// checkOwnerOnStartup();

// Routes
app.use("/api/auth", require("./routes/auth")); // ⚠️ Ye rakh sakte hain
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

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
