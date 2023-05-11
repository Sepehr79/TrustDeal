import { useState } from "react"
import { Link } from "react-router-dom"
import './manageTask.css'
import TaskTable from "./taskTable"



const ManageTask = ({ contractInstance, account }) => {

    const [task, setTask] = useState('')

    return (
        <div>

            <form onSubmit={(event) => {
                event.preventDefault()
                contractInstance.methods.tasks(event.target.taskAddr.value).call()
                .then(result => {
                    fetch(`http://localhost:8080/tasks/${result.taskAddr}`, {
                        method: 'get',
                        headers: {
                            "content-type": "application/json"
                        }
                    }).then(response => { response.json().then(response => {
                        result.header = response.header
                        result.description = response.description
                        console.log(result)
                        setTask(result)
                    })})
                })
                
            }}>
                <input type='text' name='taskAddr' placeholder="Task address" />
                <input type='submit' value='Submit' />
            </form>
            <br /> 
            <TaskTable account={account} contractInstance={contractInstance} task={task} />
            <br />
            <ul>
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/createTask'>Create new task</Link></li>
                <li><Link to='/funds'>Funds</Link></li>
            </ul>    
        </div>
    )
}

export default ManageTask