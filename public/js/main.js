let toDoItem = document.querySelectorAll(' .task')
let completedTasks = document.querySelectorAll(' .completed ')

toDoItem.forEach(a => a.addEventListener('click', _ => {
    sendRequest(a, '/completeTask')
}))

completedTasks.forEach(b => b.addEventListener('click', _ => {
    sendRequest(b, '/undoComplete')
} ))

function sendRequest(a, path) {
    let task = a.textContent

    fetch(path, {
        method: 'put',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify( {currentTask: task} )
    })
    .then(res => {
        //if the request is successful, return the response 
        if (res.ok) return res.json()
    })
    .then(data => {
        // refreshes the page to update the content
        window.location.reload()
    })    
}