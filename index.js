const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000;

// middleWare
app.use(cors())
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z6box3t.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect();

        const productCollection = client.db('productDB').collection('product')
        const cartCollection = client.db('productDB').collection('cartData')

        // read operation
        app.get('/product', async (req, res) => {
            const cursor = productCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        // read operation id based
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await productCollection.findOne(query)
            res.send(result)
        })

        // add product operation 
        app.post('/product', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);

            const result = await productCollection.insertOne(newProduct)
            res.send(result)
        })

        // update operation
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedProduct = req.body;
            const product = {
                $set: {
                    name: updatedProduct.name,
                    brand: updatedProduct.brand,
                    img: updatedProduct.img,
                    type: updatedProduct.type,
                    rating: updatedProduct.rating,
                    price: updatedProduct.price,
                    description: updatedProduct.description
                }
            }
            const result = await productCollection.updateOne(filter, product, options)
            res.send(result)
        })


        // read cart product
        app.get('/cart', async (req, res) => {
            const cursor = cartCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        // add cart product 
        app.post('/cart', async (req, res) => {
            const newCart = req.body;
            console.log(newCart);

            const result = await cartCollection.insertOne(newCart)
            res.send(result)
        })



        // delete a cart data
        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await cartCollection.deleteOne(query)
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







app.get('/', (req, res) => {
    res.send('food and baverage brand server is running now!')
})

app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
})