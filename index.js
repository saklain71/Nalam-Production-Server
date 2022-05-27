const express = require('express')
const app = express()
const port = process.env.PORT ||  5000
const dotenv = require('dotenv')
const cors = require('cors')
const jwt = require('jsonwebtoken');


app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.imwsu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("nalamdb").collection("products");
  // perform actions on the collection object
  console.log('connected DB')
  client.close();

});



app.get('/', (req, res) => {
  res.send('Welcome to Nalam tools Server')
})
app.get('/server', (req, res) => {
  res.send('services pendings')
})

app.listen(port, () => {
  console.log(`Nalam-Tools Server running on port ${port}`)
})
