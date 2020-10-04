const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
app.use(cors())
app.use(bodyParser.json())

const port = 5000
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jbp81.mongodb.net/${process.env.DB_NAME}>?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.send("Hello Working db")
})
client.connect(err => {
    const volunteersCollection = client.db(process.env.DB_NAME).collection("volunteers");
    // const ordersCollection = client.db(process.env.DB_NAME).collection("orders");
    // perform actions on the collection object

    console.log("connected")
    app.post('/addProduct', (req, res) => {
        const products = req.body
        productsCollection.insertOne(products)
            .then(result => {
                console.log(result.insertedCount)
                res.send(result.insertedCount)
            })

    })

    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })


    app.get('/product/:key', (req, res) => {
        productsCollection.find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })

    app.post('/productByKeys', (req, res) => {
        const productKeys = req.body;

        productsCollection.find({ key: { $in: productKeys } })
            .toArray((err, documents) => {
                console.log(documents)
                res.send(documents)
            })
    })


    app.post('/addOrder', (req, res) => {
        const order = req.body
        ordersCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0)
            })

    })


});


app.listen(port)