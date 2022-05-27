const express = require('express')
const app = express()
const port = process.env.PORT ||  5000
const dotenv = require('dotenv')
const cors = require('cors')
const jwt = require('jsonwebtoken');


app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
  res.send('Welcome to Nalam tools Server')
})
app.get('/server', (req, res) => {
  res.send('services pendings')
})

app.listen(port, () => {
  console.log(`Nalam-Tools Server running on port ${port}`)
})
