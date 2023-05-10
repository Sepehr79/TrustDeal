import { useState } from "react"
import { Link } from "react-router-dom"
import './manageTask.css'



const ManageTask = ({ contractInstance, account }) => {

    const [task, setTask] = useState('')

    return (
        <div>

            <form onSubmit={(event) => {
                event.preventDefault()
                contractInstance.methods.tasks(event.target.taskAddr.value).call()
                .then(result => {
                    setTask(result)
                })
                
            }}>
                <input type='text' name='taskAddr' placeholder="Task address" />
                <input type='submit' value='Submit' />
            </form>
            <br />
            <ul>
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/createTask'>Create new task</Link></li>
                <li><Link to='/funds'>Funds</Link></li>
            </ul>
            <br /> 
                    <table>
                        <tr>
                            <td>Header</td>
                            <td>Description</td>
                            <td>State</td>
                            <td>Requester</td>
                            <td>Salary</td>
                            <td>Proof of trust</td>
                            <td>Minimum proof of trust for worker</td>
                            <td>Worker proof of trust</td>
                            <td>Worker</td>
                        </tr>
                        <tr>
                            <td>Simple header</td>
                            <td>Simple description</td>
                            <td>{ task.state }</td>
                            <td>{ task.requester } </td>
                            <td>{ task.salary / 1e18 } Eth</td>
                            <td>{ task.requesterProofOfTrust / 1e18 } Eth</td>
                            <td>{ task.requesterMinimumTrustValueForWorker / 1e18 } Eth</td>
                            <td>{ task.workerProofOfTrust / 1e18 } Eth</td>
                            <td>{ task.worker }</td>
                        </tr>
                    </table> 
            
        </div>
    )
}

export default ManageTask