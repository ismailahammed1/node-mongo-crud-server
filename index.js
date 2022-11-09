// @ts-nocheck
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
//middleware

//user: userdb2
//mongodb: fFBdzwMzLxEcLjPh

app.use(cors());
app.use(express.json());
const uri =
  "mongodb+srv://userdb2:fFBdzwMzLxEcLjPh@cluster0.dyugevw.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const userCollection = client.db("nodeMongoCurd").collection("user");

    app.get("/users", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const user = await userCollection.findOne(query);
      res.send(user);
    });

    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const user = req.body;
      const option = { upsert: true };
      const updatedUser = {
        $set: {
          name: user.name,
          address: user.address,
          email: user.email,
        },
      };
      const result = await userCollection.updateOne(
        filter,
        updatedUser,
        option
      );
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      //   console.log("hi this id", id);
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
      console.log(result);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("HEllo from node mongodb crud server");
});
app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
