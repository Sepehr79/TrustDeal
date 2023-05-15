import { useState } from "react"
import { Link } from "react-router-dom"
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
                <input type='text' className="w-25 m-1" name='taskAddr' placeholder="Task address" /><br />
                <input className="btn btn-secondary w-25 m-1" id="submit" type='submit' value='Search Task' />
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