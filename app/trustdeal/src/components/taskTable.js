import { useEffect } from 'react'
import './taskTable.css'

const TaskState = {
    "0": "Created",
    "1": "Accepted",
    "2": "Done",
    "3": "Finished",
    "4": "Canceled"
}

function create_task(task, contractInstance, account) {
    return (
        <div>
            <table>
                <tr>
                    <td>Header</td>
                    <td>Description</td>
                    <td>State</td>
                    <td>Requester</td>
                    <td>Salary</td>
                    <td>Proof of trust</td>
                    <td>Minimum proof of trust for worker</td>
                    <td>Accept task</td>
                        </tr>
                        <tr>
                            <td>{ task.header }</td>
                            <td>{ task.description }</td>
                            <td>{ TaskState[task.state] }</td>
                            <td>{ task.requester } </td>
                            <td>{ task.salary / 1e18 } Eth</td>
                            <td>{ task.requesterProofOfTrust / 1e18 } Eth</td>
                            <td>{ task.requesterMinimumTrustValueForWorker / 1e18 } Eth</td>
                            <td>
                                <form onSubmit={(event) => {
                                    event.preventDefault()
                                    contractInstance.methods.acceptTask(task.taskAddr, (event.target.proofOfTrust.value * 1e18).toFixed())
                                    .send({ from: account })
                                    .then(result => {
                                        alert("Task state updated!")
                                        console.log(result)
                                    })
                                }}>
                                    <input type='number' name='proofOfTrust' step='any' placeholder='Prove your trust!' />
                                    <input type='submit' value='Accept task' />
                                </form>
                            </td>
                        </tr>
                    </table>
        </div> 
    )
}

function accept_task(task, contractInstance, account) {

}

function done_task(task, contractInstance, account) {

}

function finish_task(task, contractInstance, account) {

}

function cancel_task(task, contractInstance, account) {

}

const TaskTable = ({ task, contractInstance, account }) => {

    
    switch(task.state) {
        case "0": return create_task(task, contractInstance, account)
        case "1": return accept_task(task)
        case "2": return done_task(task)
        case "3": return finish_task(task)
        case "4": return cancel_task(task)
        default: return ( <p>Enter task address to see</p> ) 
    }
    

}

export default TaskTable;