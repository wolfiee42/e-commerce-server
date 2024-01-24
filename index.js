const express = require('express');
require('dotenv').config()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
const userCollection = database.collection("Users")
const wishListCollection = database.collection("Wishlist")
const cartCollection = database.collection("Cart");
const reviewCollection = database.collection("Review");


app.get('/', (req, res) => {
    res.send("Server is Running")
})

// displaying products
app.get('/allproducts', async (req, res) => {
    const category = req.query.category;
    if (category) {
        const filter = { classification: category }
        const result = await productsCollection.find(filter).toArray();
        res.send(result);
    } else {
        const result = await productsCollection.find().toArray();
        res.send(result);

    }
})


// product count
app.get('/totalproductcount', async (req, res) => {
    const result = await productsCollection.estimatedDocumentCount();
    res.send({ result })
})

// user information storing in database
app.post('/users', async (req, res) => {
    const user = req.body;
    const filter = { email: user.email };
    const existingUser = await userCollection.findOne(filter);
    if (existingUser) {
        return res.send("User Exists");
    }
    const result = await userCollection.insertOne(user);
    res.send(result);


})

// conditionally getting user email to verify whether he is admin or not
app.get("/users", async (req, res) => {
    const email = req.query.email;
    const filter = { email: email }
    const user = await userCollection.findOne(filter);
    let admin = false;
    if (user) {
        admin = user?.role === "Admin"
    }
    res.send({ admin });
})


// adding wishlist to database
app.post('/wishlists', async (req, res) => {
    const item = req.body;
    const result = await wishListCollection.insertOne(item);
    res.send(result)
})

// delete item from wishlist
app.delete('/wishlist', async (req, res) => {
    const email = req.query.email;
    const id = req.query.id;
    const filter1 = { email: email };
    const filter2 = { _id: new ObjectId(id) };
    const result = await wishListCollection.deleteOne(filter1, filter2);
    res.send(result);
})



app.get("/wishlists", async (req, res) => {
    const email = req.query.email;
    const filter = { email: email }
    const result = await wishListCollection.find(filter).toArray();
    res.send(result)
})



// adding product to cart section
app.post('/cart', async (req, res) => {
    const item = req.body;
    const result = await cartCollection.insertOne(item);
    res.send(result);
});


// displaying cart products on condition.
app.get('/cart', async (req, res) => {
    const email = req.query.email;
    const filter = { email: email };
    const result = await cartCollection.find(filter).toArray();
    res.send(result);
})

// delete products from cart 
app.delete('/cart', async (req, res) => {
    const email = req.query.email;
    const id = req.query.id;
    const filter1 = { email: email };
    const filter2 = { _id: new ObjectId(id) };
    const result = await cartCollection.deleteOne(filter1, filter2);
    res.send(result);
})



// getting review from client
app.post('/reviews', async (req, res) => {
    const review = req.body;
    const result = await reviewCollection.insertOne(review);
    res.send(result);
})




app.listen(port, () => {
    console.log(`server is running in port ${port}`);
})