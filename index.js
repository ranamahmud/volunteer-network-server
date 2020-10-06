const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const port = 5000


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jbp81.mongodb.net/${process.env.DB_NAME}>?retryWrites=true&w=majority`;


const app = express()
app.use(bodyParser.json())

app.use(cors())

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })



app.use(urlencodedParser)


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
                console.log("addactivity", result)
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




    app.delete("/event/:id", (req, res) => {
        console.log("id:", req.params.id)

        activityCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                console.log(result);
                res.send(result.deletedCount > 0)
            })
    })



});


app.listen(port)