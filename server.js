const express = require('express')
const app = express()

app.get('/', (request, response) => {
    response.end("Success")
})

app.listen(5000, console.log("The server is running!"))