const express = require("express");
const cors = require("cors");
const client = require("./mongodb/mongoClient");
const { ObjectId } = require("mongodb");
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
  const { sortValue } = req.query;
  try {
    let sortOrder = 1;

    if (sortValue === "asc") {
      sortOrder = 1;
    } else if (sortValue === "dsc") {
      sortOrder = -1;
    }
    const result = await req.db
      .collection("tourist")
      .find()
      .sort({ averageCost: sortOrder })
      .toArray();
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

// app.get("/tourist", async (req, res) => {
//   try {
//     const result = await req.db.collection("tourist").find({}).toArray();
//     res.send(result);
//   } catch (error) {
//     console.log(error);
//   }
// });

app.get("/tourist/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = { _id: new ObjectId(id) };
    const result = await req.db.collection("tourist").findOne(query);
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
    travelTime,
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
    travelTime,
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

app.delete("/tourist/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = { _id: new ObjectId(id) };
    const result = await req.db.collection("tourist").deleteOne(query);
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

app.put("/tourist/:id", async (req, res) => {
  try {
    const {
      averageCost,
      countryName,
      imageUrl,
      location,
      seasonality,
      shortDescription,
      spotName,
      totalVisitorsPerYear,
      travelTime,
      userEmail,
      userName,
    } = req.body;
    const { id } = req.params;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updateDoc = {
      $set: {
        averageCost,
        countryName,
        imageUrl,
        location,
        seasonality,
        shortDescription,
        spotName,
        totalVisitorsPerYear,
        travelTime,
        userEmail,
        userName,
      },
    };
    const result = await req.db
      .collection("tourist")
      .updateOne(filter, updateDoc, options);
    res.send(result);
  } catch (error) {}
});

app.post("/users", async (req, res) => {
  try {
    const { email, displayName, photoURL } = req.body;
    const user = {
      email,
      displayName,
      photoURL,
    };
    const result = await req.db.collection("users").insertOne(user);
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

app.get("/users/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const query = { userEmail: email };
    const result = await req.db.collection("tourist").find(query).toArray();
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Listing Port ${port}`);
});
