const express = require('express');
require('dotenv').config()
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 8000;


// middleware
app.use(cors());
app.use(express.json());






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
        console.log(error);
    }
}
dbConnet();

const database = client.db("eCommerce")
const productsCollection = database.collection("Products");


app.get('/', (req, res) => {
    res.send("Server is Running")
})

// displaying products
app.get('/allproducts', async (req, res) => {
    const category = req.query.category;
    const filter = { classification: category }
    const result = await productsCollection.find(filter).toArray();
    res.send(result);
})






app.listen(port, () => {
    console.log(`server is running in port ${port}`);
})