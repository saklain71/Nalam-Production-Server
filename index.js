const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const dotenv = require('dotenv')
const cors = require('cors')
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors())
app.use(express.json())

const uri = "mongodb+srv://nalam-tools:tZy0JmllyAsHjWRo@cluster0.imwsu.mongodb.net/?retryWrites=true&w=majority";

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
      console.log(id)
      const filter = { _id: ObjectId(id) }
      const quantity = req.body
      console.log(quantity)
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
      const query = {_id:ObjectId(id)}
      const products = await productsCollection.findOne(query)
      res.send(products)
    })

    //post

    app.post("/order", async (req, res) => {
      const order = req.body
      const result = await orderCollection.insertOne(order)
      res.send(result)
    })

    //

    // update
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
      const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN, { expiresIn: "1d" })
      res.send({ result, token })
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
