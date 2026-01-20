const app = require("./src/app");
const db = require("./src/models");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

db.sequelize.authenticate().then(() => {
    console.log("Database connect");
    return db.sequelize.sync({ alter: true });
  }).then(() => {
    console.log("Models synced");
    app.listen(PORT, () => {
      console.log(`Server on port ${PORT}`);
    });
  }) .catch((err) => {
    console.error("DB connect error:", err);
  });