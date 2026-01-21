const app = require("./src/app");
const db = require("./src/models");
require("dotenv").config();

const PORT = process.env.PORT || 8080;
const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Database connected");

    await db.sequelize.sync({ alter: true });
    console.log("Models synced");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
};

startServer();