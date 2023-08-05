const express = require('express')
const app = express()
// database
require("dotenv").config()
const { MongoClient } = require("mongodb");

// body parser for the data in the request
const bodyParser = require('body-parser')
// creates an object from the form data and stores it in the request body property
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
let db,
    databaseURI = process.env.MONGO_URI,
    dbName = "tasks"

MongoClient.connect(databaseURI, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to the ${dbName} database`)
        db = client.db(dbName)
    })
    .catch(err => {
        console.error(err)
    })

// tells the server the templating language we are using
app.set('view engine', 'ejs')    

app.get("/", (request, response) => {
    // the find() gets all the data in the tasks collection
    // the toArray() converts the data into an array of objects
    db.collection("tasks").find().toArray()
    .then( tasks => {
        response.render('index.ejs', { items: tasks})
    })
})

app.post('/createTask', (request, response) => {
    let task = {
        task: request.body.task,
        completed: false
    }
    db.collection('tasks').insertOne(task)
        .then(res => response.redirect('/'))
        .catch(err => {
            console.error(err)
        })
})

// access the public directory
app.use(express.static('public'))
app.put('/completeTask', (request, response) => {
    console.log('Task Completed!')
    updatingDatabase(true)
})

app.put('/undoComplete', (request, response) => {
    console.log('Task is not completed')
    updatingDatabase(false)
})

function updatingDatabase(boolean) {
    db.collection('tasks').updateOne( 
        // find the task from the request body in the database
        { task: request.body.currentTask }, {
            // changing the completed property
        $set: {
            completed: boolean 
        }
    }, {
        //  if the task is not in the database, create the task
        upsert: true
    })
    //the response that is sent back to the fetch request
    .then(res => {
        response.json('Success')
    })
    .catch(err => console.error(err))
}
app.listen(5000, console.log("The server is running!"))