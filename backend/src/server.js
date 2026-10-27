const { openDatabase } = require("./db");
const { createApp } = require("./app");
const db = openDatabase();
const server = createApp(db).listen(process.env.PORT || 3001, "0.0.0.0", () => {
  console.log(`Backend działa na porcie ${server.address().port}`);
});
function shutdown() {
  server.close(() => { db.close(); process.exit(0); });
  setTimeout(() => process.exit(1), 10000).unref();
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
