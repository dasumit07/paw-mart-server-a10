const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kfapxri.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const db = client.db('PawMart')
    const collections = db.collection('pets/suplies')
    const orderCollections = db.collection('orders')

    app.get('/pets', async (req, res)=>{
      const result = await collections.find().toArray();
      res.send(result);
    })

    app.post('/pets', async (req, res)=>{
      const data = req.body;
      const result = await collections.insertOne(data);
      res.send(result);
    })

    app.get('/pets/:id', async (req, res)=>{
      const {id} = req.params;
      const objectId = new ObjectId(id);
      const result = await collections.findOne({_id: objectId});
      res.send(result);
    })

    app.post('/orders', async (req, res)=>{
      const data = req.body;
      const result = await orderCollections.insertOne(data);
      res.send(result);
    })

    app.get('/myOrders', async(req,res)=>{
      const email = req.query.email;
      const result = await orderCollections.find({email: email}).toArray();
      res.send(result);
    })

    app.get('/orders', async (req, res)=>{
      const result = await orderCollections.find().toArray();
      res.send(result);
    })

    app.get('/latest-items', async (req, res)=>{
      const result = await collections.find().sort({date: 'desc'}).limit(6).toArray();
      res.send(result);
    })

    app.get('/myListings', async(req,res)=>{
      const email = req.query.email;
      const result = await collections.find({email: email}).toArray();
      res.send(result);
    })

    app.put('/pets/:id', async (req, res)=>{
      const {id} = req.params;
      const data = req.body;
      const objectId = new ObjectId(id);
      const update = {
        $set: data
      }
      const result = await collections.updateOne({_id: objectId}, update);
      res.send(result);
    })

    app.delete('/pets/:id', async (req, res)=>{
      const {id} = req.params;
      const objectId = new ObjectId(id);
      const result = await collections.deleteOne({_id: objectId});
      res.send(result);
    })

    app.get('/search', async (req,res) =>{
      const searchText = req.query.search;
      const result = await collections.find({name: {$regex: searchText, $options: "i"}}).toArray();
      res.send(result);
    })



    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Hello server!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
