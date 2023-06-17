require("dotenv").config();

const express = require("express");
const app = express();

const connectToDb = require("./utils/connection");
connectToDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routes/authRoute");
const communityRoutes = require("./routes/communityRoute");
const memberRoutes = require("./routes/memberRoute");
const roleRoutes = require("./routes/roleRoute");

app.use("/v1/auth", authRoutes);
app.use("/v1/community", communityRoutes);
app.use("/v1/member", memberRoutes);
app.use("/v1/role", roleRoutes);

app.use("/", (req, res) => {
  return res.send("Server is up and runnning! ");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at PORT: ${PORT}`);
});
