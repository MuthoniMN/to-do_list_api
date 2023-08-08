const express = require('express')
const app = express()
const PORT = process.env.PORT
// database
require("dotenv").config()
const { MongoClient } = require("mongodb");

// body parser for the data in the request
const bodyParser = require('body-parser')
// creates an object from the form data and stores it in the request body property
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// global database variables
let databaseURI = process.env.MONGO_URI

const client = new MongoClient(databaseURI)
const db = client.db("tasks")

// tells the server the templating language we are using
app.set('view engine', 'ejs')    

// Reading tasks from the database and rendering them
app.get("/", (request, response) => {
    // the find() gets all the data in the tasks collection
    // the toArray() converts the data into an array of objects
    db.collection("tasks").find().toArray()
    .then( tasks => {
        // the items property should be used in the template
        response.render('index.ejs', { items: tasks})
    })
})

//Creating tasks and adding them to the database
app.post('/createTask', (request, response) => {
    // creating the task object
    let task = {
        task: request.body.task,
        priority: request.body.priority,
        category: request.body.category,
        completed: false
    }
    // adding the task object into the database
    db.collection('tasks').insertOne(task)
    // this should be done if the task has been successful
        .then(res => response.redirect('/'))
        .catch(err => {
            console.error(err)
        })
})

// access the public directory
app.use(express.static('public'))

// updating the database

// completing a task
app.put('/completeTask', (request, response) => {
    console.log('Task Completed!')
    updatingDatabase(request.body.currentTask, true, response)
})

// marking a task incomplete
app.put('/undoComplete', (request, response) => {
    console.log('Task is not completed')
    updatingDatabase(request.body.currentTask , false, response)
})

function updatingDatabase(task, boolean, response) {
    db.collection('tasks').updateOne( 
        // find the task from the request body in the database
        { task: task.trim()}, {
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

// deleting a task
app.delete('/deleteTask', (request, response) => {
    db.collection('tasks').deleteOne( { task: request.body.currentTask })
        //the response that is sent back to the fetch request
        .then(res => {z
            response.json('Success')
        })
        .catch(err => console.error(err))
    console.log("Task has been deleted")
})

// connecting the database
client.connect(err =>{
        if(err){
            console.error(err); 
            return false;
        }
        
    app.listen(PORT, console.log("The server is running!"))
    }
)