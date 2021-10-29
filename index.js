const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors')//cors for own server connected with own
const ObjectId = require('mongodb').ObjectId;
const app = express();
require("dotenv").config();//dotenv config
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3aidp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);


async function run() {
    try {
        await client.connect();
        const database = client.db("Travel-Hype");
        const servicesCollection = database.collection("services");
        const eventsCollection = database.collection("users");

        //getServices
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            console.log(services);
            res.send(services);
        })

        //AddServices
        app.post('/addServices', async (req, res) => {
            const newService = req.body;
            const result = await servicesCollection.insertOne(newService);
            res.json(result);
        })

        //Find single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.send(service);
        })

        // add events
        app.post("/addEvent", async (req, res) => {
            console.log(req.body);
            const result = await eventsCollection.insertOne(req.body);
            console.log(result);
        });

        //My events
        app.get("/myEvents/:email", async (req, res) => {
            const result = await eventsCollection.find({
              email: req.params.email,
            }).toArray();
            res.send(result);
          });

          //Delete Event
          app.delete('/deleteEvents/:id', async(req,res) => {
              const id = req.params.id;
            //   console.log(id);
              const query = { _id: ObjectId(id)};
              const result = await eventsCollection.deleteOne(query);
              console.log(result);
              res.json(result);
          })


    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Server is running')
});

app.listen(port, () => {
    console.log('Port is running');
})