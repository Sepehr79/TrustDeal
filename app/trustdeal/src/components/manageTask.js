import { useState } from "react"
import { Link } from "react-router-dom"
import './manageTask.css'
import TaskTable from "./taskTable"



const ManageTask = ({ contractInstance, account }) => {

    const [task, setTask] = useState('')

    function clickSubmit () {
        document.getElementById('submit').click()
    }

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
                <input className="btn-primary" id="submit" type='submit' value='Submit' />
            </form>
            <br /> 
            <TaskTable account={account} contractInstance={contractInstance} task={task} submitClick={clickSubmit} />
            <br />
            <button className="btn btn-primary w-25 m-1">
                <Link className="text-white text-decoration-none h6" to='/'>Home</Link>
            </button><br></br>
            <button className="btn btn-primary w-25 m-1">
                <Link className="text-white text-decoration-none h6" to='/funds'>Manage Funds</Link>
            </button><br></br>
            <button className="btn btn-primary w-25 m-1">
                <Link className="text-white text-decoration-none h6" to='/createTask'>Create new task</Link>
            </button><br></br>
        </div>
    )
}

export default ManageTask