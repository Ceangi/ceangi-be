const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

var corsOptions = {
  origin: "*", // use your actual domain name (or localhost), using * is not recommended
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Origin",
    "X-Requested-With",
    "Accept",
    "x-client-key",
    "x-client-token",
    "x-client-secret",
    "Authorization",
    "x-access-token",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const db = require("./app/models");

db.sequelize.sync().then(() => {

});

// simple route
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to cms application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/role.routes")(app);
require("./app/routes/song.routes")(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
