const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.port || 5000;
// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is running HiHHHHHHHHHHHHHHHHHH");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PAS}@mehedi94.yr2zg.mongodb.net/?retryWrites=true&w=majority&appName=mehedi94`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const movieDB = client.db("movieDB").collection("movies");
    const favorite = client.db("movieDB").collection("favoriteMovies");
   
    // section movie related api
    app.post("/addmovie", async (req, res) => {
      const newMovie = req.body;
      console.log("creating new movie", newMovie);
      const result = await movieDB.insertOne(newMovie);
      res.send(result);
    });
    app.get("/addmovie", async (req, res) => {
      const cursor = movieDB.find().limit(6).sort({ rating: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/allmovies", async (req, res) => {
      const cursor = movieDB.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/moviedetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await movieDB.findOne(query);
      res.send(result);
    });

    app.delete("/moviedetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await movieDB.deleteOne(query);
      res.send(result);
    });


    app.post("/moviedetails", async (req, res) => {
      const favMovie=req.body;
      const result = await favorite.insertOne(favMovie);
      res.send(result);
    });

    app.get("/moviedetails", async (req, res) => {
      const cursor = favorite.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.delete("/moviedetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await favorite.deleteOne(query);
      res.send(result);
    });
    
  } finally {
    // await client.close();
  }
}
run().catch(console.log);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
