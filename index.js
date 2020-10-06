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
    const activityCollection = client.db(process.env.DB_NAME).collection("activities");

    console.log("connected")

    // Event add post request
    app.post('/addActivity', (req, res) => {
        const activity = req.body
        activityCollection.insertOne(activity)
            .then(result => {
                console.log(result.insertedCount)
                if (result.insertedCount > 0) {
                    res.sendStatus(200)
                } else {
                    result.sendStatus(404)
                }
            })

    })

    // Send all event data

    app.get('/getEvents/:email', (req, res) => {
        activityCollection.find({ email: req.params.email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })




    // app.get('/activity/:email', (req, res) => {
    //     productsCollection.find({ email: req.params.key })
    //         .toArray((err, documents) => {
    //             res.send(documents[0])
    //         })
    // })

    // app.post('/productByKeys', (req, res) => {
    //     const productKeys = req.body;

    //     productsCollection.find({ key: { $in: productKeys } })
    //         .toArray((err, documents) => {
    //             console.log(documents)
    //             res.send(documents)
    //         })
    // })


    // app.post('/addActivity', (req, res) => {
    //     const order = req.body
    //     ordersCollection.insertOne(order)
    //         .then(result => {
    //             res.send(result.insertedCount > 0)
    //         })

    // })


});


app.listen(port)