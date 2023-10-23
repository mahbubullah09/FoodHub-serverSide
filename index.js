

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.ennn1mj.mongodb.net/?retryWrites=true&w=majority`;

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

    const productsCollection = client.db('productDB').collection('products');
    const myCartCollection = client.db('productDB').collection('myCart');

// get data

app.get('/products', async(req,res)=>{
    const cursor = productsCollection.find();
    const result = await cursor.toArray();
    res.send(result);
})
app.get('/products/:id', async(req,res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}

    
    const result = await productsCollection.findOne(query);

    res.send(result);
})

//update

app.put('/products/:id', async(req,res)=>{
    const id = req.params.id;
    const filter ={_id : new ObjectId(id)}
    const options = {upsert: true};
    const updatedProduct= req.body;
    const product ={
        $set: {
            image: updatedProduct.image, 
            product: updatedProduct.product, 
            brand_name: updatedProduct.brand_name, 
            category: updatedProduct.category, 
            rating: updatedProduct.rating, 
            price: updatedProduct.price, 
            description: updatedProduct.description
        }
    }

    const result = await productsCollection.updateOne(filter, product)
    
    res.send(result);
})





    //send product

    app.post('/products', async(req,res) =>{
        const newProduct= req.body;
        console.log(newProduct);

    const result = await productsCollection.insertOne(newProduct);
    res.send(result);
    })


    //send in cart
    app.post('/myCart', async(req,res) =>{
        const newCart= req.body;
        console.log(newCart);

    const result = await myCartCollection .insertOne(newCart);
    res.send(result);
    })

    app.get('/myCart', async(req,res)=>{
        const cursor = myCartCollection.find();
        const result = await cursor.toArray();
        res.send(result);
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
    res.send('foodHub server is running')
})

app.listen(port, () => {
    console.log(`foodHub Server is running on port: ${port}`)
})