const app = require("./app");
// Handle uncaught exceptions (synchronous errors not caught anywhere)
process.on("uncaughtException", (err) => {
  console.log("💥 Uncaught Exception:", err.message);
  process.exit(1); // Exit the process immediately (optional but recommended)
});

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("🔴 Unhandled Promise Rejection:", err.message);
  server.close(() => {
    console.log("Server shut down due to unhandled rejection");
    process.exit(1); // Exit the process
  });
});
