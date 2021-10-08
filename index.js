const express = require('express');
const bodyParser = require('body-parser')

const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const uri = "mongodb+srv://StuffRecord:EscL2l97QodhOlJV@cluster0.cb3vq.mongodb.net/stuffData?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const password = 'EscL2l97QodhOlJV'

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})



client.connect(err => {
    const collection = client.db("stuffData").collection("stuffs");

    app.get('/stuffs', (req, res) => {
        collection.find({})
        .toArray( (err,document) => {
            res.send(document)
        })
    })

    app.post('/addStuff', (req, res) => {
        const information = req.body
        collection.insertOne({
            "name": information.name,
            "email": information.email,
            "post": information.job
        })
        res.redirect('/')
    })

    app.get(`/loadSinglePerson/:id`, (req, res) => {
        collection.find({_id: ObjectId(req.params.id)})
        .toArray( (err,document) => {
            res.send(document[0])
        })
    })

    app.patch('/update/:id', (req, res) => {
        collection.updateOne({_id: ObjectId(req.params.id)},
        {
            $set: {
                name: req.body.updateName,
                email: req.body.updateEmail,
                post: req.body.updateJob,
            }
        })
        .then(result => {
            res.send(result.modifiedCount > 0)
        })
    })

    app.delete('/delete/:id', (req, res) => {
        collection.deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {
            res.send(result.deletedCount > 0) 
            
        })
    })

  });

app.listen(3000, () => console.log('Port is running on 3000'))