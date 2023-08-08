let toDoItem = document.querySelectorAll(' .task')
let completedTasks = document.querySelectorAll(' .completed ')
const deleteBtns = document.querySelectorAll(' .fa-trash ')

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

deleteBtns.forEach(btn => {
    btn.addEventListener('click', _ => {
        // get the text associated with the delete button
        let task = btn.parentNode.children[1].textContent.trim()

        fetch('/deleteTask', {
            method: 'delete',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ currentTask: task })
        })
        .then(res => {
            //if the request is successful, return the response 
            if (res.ok) return res.json()
        })
        .then(data => {
            // refreshes the page to update the content
            window.location.reload()
        })  
    })  
})