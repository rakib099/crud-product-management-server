const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Product Management Server running");
});

// user: dbUser3
// pass: IdH8cwN1XSz5kkjF


const uri = "mongodb+srv://dbUser3:IdH8cwN1XSz5kkjF@cluster0.i9w8jvi.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const productsCollection = client.db("crudProducts").collection("products");

        app.get('/products', async (req, res) =>  {
            const query = {};
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const product = await productsCollection.findOne(query);
            res.send(product);
        });

        app.post('/add', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            console.log(result);
            res.send(result);
        });

        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const product = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updatedProduct = {
                $set: {
                    name: product.name,
                    price: product.price,
                    photoURL: product.photoURL,
                    quantity: product.quantity
                }
            }
            const result = await productsCollection.updateOne(filter, updatedProduct, options);
            console.log(result);
            res.send(result);
        });

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productsCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        });
    }
    finally {

    }
}

run().catch(console.dir)

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})