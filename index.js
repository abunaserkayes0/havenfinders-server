const express = require("express");
const cors = require("cors");
const client = require("./mongodb/mongoClient");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

async function connectDB(req, res, next) {
  if (!client.isConnected) {
    try {
      await client.connect();
      console.log("Connected to MongoDB");
    } catch (error) {
      return res
        .status(500)
        .send({ error: "Failed to connect to the database", details: error });
    }
  }
  req.db = client.db("touristCollection");
  next();
}

app.use(connectDB);

app.get("/", (req, res) => {
  res.send("Hello Express");
});

app.get("/tourist", async (req, res) => {
  try {
    const result = await req.db.collection("tourist").find({}).toArray();
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

app.post("/tourist", async (req, res) => {
  const {
    averageCost,
    countryName,
    imageUrl,
    location,
    seasonality,
    shortDescription,
    spotName,
    totalVisitorsPerYear,
    travelCost,
    userEmail,
    userName,
  } = req.body;

  const doc = {
    averageCost,
    countryName,
    imageUrl,
    location,
    seasonality,
    shortDescription,
    spotName,
    totalVisitorsPerYear,
    travelCost,
    userEmail,
    userName,
  };

  try {
    const result = await req.db.collection("tourist").insertOne(doc);
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Listing Port ${port}`);
});
