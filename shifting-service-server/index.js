const express = require("express");
const cors = require("cors");
var jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9ntgkem.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    // console.log("database connect");
    const acCollection = client.db('shifting-service').collection('ac');
    const allServicesCollection = client
      .db('shifting-service')
      .collection('allServices');
    const applianceCollection = client
      .db('shifting-service')
      .collection('appliance-repair');
    const userCollection = client.db('shifting-service').collection('user');
    const bookingCollection = client
      .db('shifting-service')
      .collection('bookAppliance');
    const serviceDoneCollection = client
      .db('shifting-service')
      .collection('serviceDone');

    // post User
    app.post('/users', async (req, res) => {
      const newProduct = req.body;
      const result = await userCollection.insertOne(newProduct);
      res.send(result);
    });

    // get by address
    app.get('/users/:service', async (req, res) => {
      const service = req.params.service;
      const query = { service };
      const cursor = userCollection.find(query);
      const user = await cursor.toArray();
      res.send(user);
    });

    // get ac
    app.get('/ac', async (req, res) => {
      const query = {};
      const cursor = acCollection.find(query);
      const mainProducts = await cursor.toArray();
      res.send(mainProducts);
    });

    //                    Appliance
    // get Appliance
    app.get('/appliance', async (req, res) => {
      const query = {};
      const cursor = applianceCollection.find(query);
      const mainProducts = await cursor.toArray();
      res.send(mainProducts);
    });
    // get by id
    app.get('/appliance/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const products = await applianceCollection.findOne(query);
      res.send(products);
    });

    // post appliance book services
    app.post('/bookAppliance', async (req, res) => {
      const newProduct = req.body;
      const result = await bookingCollection.insertOne(newProduct);
      res.send(result);
    });
    // get Book Appliances
    app.get('/bookAppliances', async (req, res) => {
      const query = {};
      const cursor = bookingCollection.find(query);
      const mainProducts = await cursor.toArray();
      res.send(mainProducts);
    });
    // all Book filter by service category
    app.get('/bookAppliances/:service', async (req, res) => {
      const service = req.params.service;
      const query = { service };
      const cursor = bookingCollection.find(query);
      const user = await cursor.toArray();
      res.send(user);
    });
    app.get('/bookAppliancesId/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const products = await bookingCollection.findOne(query);
      res.send(products);
    });
    // Delete one Booking collection
    app.delete('/bookAppliances/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    });
    // restock blood item and update
    app.put('/bookAppliancesService/:id', async (req, res) => {
      const id = req.params.id;
      const updateAccept = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          accept: updateAccept.accept,
        },
      };
      const result = await bookingCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });
    // post appliance book services with accept
    app.post('/bookServiceDone', async (req, res) => {
      const newProduct = req.body;
      const result = await serviceDoneCollection.insertOne(newProduct);
      res.send(result);
    });
    // get done application
    app.get('/bookDoneAppliances', async (req, res) => {
      const query = {};
      const cursor = serviceDoneCollection.find(query);
      const mainProducts = await cursor.toArray();
      res.send(mainProducts);
    });
    // all Book filter by service category
    app.get('/bookDoneAppliance/:service', async (req, res) => {
      const service = req.params.service;
      const query = { service };
      const cursor = serviceDoneCollection.find(query);
      const user = await cursor.toArray();
      res.send(user);
    });
    //                        ALl services
    // All Services Collection
    app.post('/allServices', async (req, res) => {
      const newProduct = req.body;
      const result = await allServicesCollection.insertOne(newProduct);
      res.send(result);
    });
    // get all services
    app.get('/allServices', async (req, res) => {
      const query = {};
      const cursor = allServicesCollection.find(query);
      const mainProducts = await cursor.toArray();
      res.send(mainProducts);
    });
    // all service filter by service category
    app.get('/allServices/:service', async (req, res) => {
      const service = req.params.service;
      const query = { service };
      const cursor = allServicesCollection.find(query);
      const user = await cursor.toArray();
      res.send(user);
    });
    // get all services by id
    app.get('/allServicesId/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const products = await allServicesCollection.findOne(query);
      res.send(products);
    });

    // Delete one Service
    app.delete('/allServices/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await allServicesCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Shifting Service");
});

app.listen(port, () => {
  console.log("Shifting Service is running ");
});
