const express = require('express')
const app = express()
const { MongoClient } = require("mongodb");
require("dotenv").config()
const databaseURI = process.env.MONGO_URI

let db,
    dbName = "tasks"

MongoClient.connect(databaseURI, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to the ${dbName} database`)
        db = client.db(dbName)
    })
    .catch(err => {
        console.error(err)  
    })

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html')
})

app.listen(5000, console.log("The server is running!"))