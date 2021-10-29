const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors')//cors for own server connected with own
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
      const usersCollection = database.collection("users");
      
      //AddServices
      app.post('/addServices', async (req,res) => {
        const newService = req.body;
        const result = await servicesCollection.insertOne(newService);
        res.json(result);
      })


    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get('/',(req,res) =>{
    res.send('Server is running')
});

app.listen(port, () =>{
    console.log('Port is running');
})