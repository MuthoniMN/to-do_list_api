let toDoItem = document.querySelectorAll(' .to-doItem span')
let completedTasks = document.querySelectorAll(' .completed ')

toDoItem.forEach(a => a.addEventListener('click', _ => {
    //get the task that has been clicked on
    let completedItem = a.textContent
    // send a request to the server
    fetch('/completeTask', {
        // specifying that it is a PUT request
        method: 'put',
        // the request is a JSON file
        headers: { 'Content-Type': 'application/json' },
        // store the task in a JSON object
        body: JSON.stringify({ completedTask : completedItem })
    })
    .then(res => {
        //if the request is successful, return the response 
        if (res.ok) return res.json()
    })
    .then(data => {
        // refreshes the page to update the content
        window.location.reload()
    })
}))
toDoItem.forEach(b => b.addEventListener('click', undoComplete))

function undoComplete() {
    console.log("UNDO")
}