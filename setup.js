function setupEnvironment() {
  const envPath = path.join(__dirname, ".env");

  if (fs.existsSync(envPath)) {
    console.log("✅ Already configured");
    return;
  }

  // Generate random JWT_SECRET
  const jwtSecret = crypto.randomBytes(64).toString("hex");

  const envContent = `PORT=3000
MONGO_URI=mongodb://localhost:27017/shopdb
JWT_SECRET=${jwtSecret}
`;

  fs.writeFileSync(envPath, envContent);
  console.log("✅ Configuration created!");
}
