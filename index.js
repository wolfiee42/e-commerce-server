const express = require('express');
require('dotenv').config()
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8000;


// middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send("Server is Running")
})



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@ecommercecluster01.0tsvj1b.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const dbConnet = async () => {
    try {
        client.connect();
        console.log("DB Connected Successfully!");
    } catch (error) {
        console.log(error.message);
    }
}
dbConnet();





app.listen(port, () => {
    console.log(`server is running in port ${port}`);
})