const express = require('express')
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config();
const cors = require('cors')
const jwt = require('jsonwebtoken');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.imwsu.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
  });

async function run() {
  try {
    await client.connect();
    const reviewCollection = client.db('nalamdb').collection('review');
    const productsCollection = client.db('nalamdb').collection('products');
    const userCollection = client.db('nalamdb').collection('users');
    const orderCollection = client.db('nalamdb').collection('orders');
    console.log('mongo db connected');


    //get Api 
    app.get('/products', async (req, res) => {
      const query = {}
      const products = await productsCollection.find(query).toArray();
      res.send(products);
    })


    app.get('/review', async (req, res) => {
      const query = req.query;
      //console.log(query);
      const review = await reviewCollection.find(query).toArray();
      res.send(review);
    })

    //post 
    app.post('/review', async (req, res) => {
      const data = req.body;
      const review = await reviewCollection.insertOne(data);
      res.send(review)
    })

    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id
      //console.log(id)
      const filter = { _id: ObjectId(id) }
      const quantity = req.body
      //console.log(quantity)
      const options = { upsert: true };
      const doc = {
        $set: {
          availableQuantity: quantity.quantity
        }
      }
      const result = await productsCollection.updateOne(filter, doc, options)
      res.send(result)

    })

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      //console.log(id);
      const query = { _id: ObjectId(id) }
      const products = await productsCollection.findOne(query)
      res.send(products)
    })



    app.get("/order", async (req, res) => {
      const email = req.query.email
      const query = { email: email }
      const result = await orderCollection.find(query).toArray()
      res.send(result)

    })
    app.get("/allorder", async (req, res) => {
      const query = { }
      const result = await orderCollection.find(query).toArray()
      res.send(result)

    })

    app.post("/order", async (req, res) => {
      const order = req.body
      const result = await orderCollection.insertOne(order)
      res.send(result)
    })

    app.get("/order/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await orderCollection.findOne(query)
      res.send(result)
    })


    app.delete("/order/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await orderCollection.deleteOne(query)
      res.send(result)
    })

    app.get("/user", async (req, res) => {
      const query = {}
      const result = await userCollection.find(query).toArray()
      res.send(result)
    })


    app.put('/user/admin/:email', async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const updateDoc = {
        $set: { role: 'admin' },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    })

    app.put('/user/:email', async (req, res) => {
      const email = req.params.email
      const filter = { email: email }
      const user = req.body
      const options = { upsert: true };
      const doc = {
        $set: {
          name: user.name,
          email: user.email,
          bio: user.bio,
          address: user.address,
          institute: user.institute,
          dateOfBirth: user.dateOfBirth,
          phone: user.phone
        }
      }
      const result = await userCollection.updateOne(filter, doc, options)
     
      res.send({ result })
    })

    app.get("/user/:email", async (req, res) => {
      const email = req.params.email
      const query = { email: email }
      const result = await userCollection.findOne(query)
      res.send(result)
    })

    app.get('/user/admin/:email', async(req, res)=>{
      const email = req.params.email;
      const user = await userCollection.findOne({email: email});
      const isAdmin = user.role === 'admin';
      //console.log(isAdmin);
      res.send({admin : isAdmin})
    })

    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await userCollection.deleteOne(query)
      res.send(result)
    })

  }

  finally { }

}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Welcome to Nalam tools Server')
})
app.get('/server', (req, res) => {
  res.send('services pendings')
})

app.listen(port, () => {
  console.log(`Nalam-Tools Server running on port ${port}`)
})
