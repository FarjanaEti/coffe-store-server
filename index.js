const express = require ('express');
const cors=require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express()
const port=process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json())

//EAG4t2SCjFDhT9I0
//coffee-muster

const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.dv2hq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)
//const uri = "mongodb+srv://coffee-muster:EAG4t2SCjFDhT9I0@cluster0.dv2hq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    
     const coffeeCollection=client.db('coffeeDB').collection('coffee')
    //add a coffee items
    app.post('/coffee',async(req,res)=>{
      const newCoffee=req.body;
      console.log(newCoffee)
      const result=await coffeeCollection.insertOne(newCoffee)
      res.send(result)
    })

    //show all coffee
    app.get('/coffee',async(req,res)=>{
      const cursor=coffeeCollection.find();//cursor mane pointer set kora
      const result=await cursor.toArray();
      res.send(result);
    })

    //delete a coffee
    app.delete('/coffee/:id', async(req,res)=>{
      const id=req.params.id
      const query={_id: new ObjectId(id)} 
      console.log(query)
      const result=await coffeeCollection.deleteOne(query)
      res.send(result)
    })
    //update single coffe
    app.put('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
          $set: req.body
      }

      const result = await coffeeCollection.updateOne(filter, updatedDoc, options )

      res.send(result);
  })


    //update
    app.get('/coffee/:id', async(req,res)=>{
      const id=req.params.id
      const query={_id: new ObjectId(id)} 
      const result=await coffeeCollection.findOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req, res)=>{
    res.send('Coffee store server is running')                          
})

app.listen(port, ()=>{
   console.log(`coffee store server is running at port: ${port}`)
})