import './taskTable.css'

const TaskState = {
    "0": "Created",
    "1": "Accepted",
    "2": "Done",
    "3": "Finished",
    "4": "Canceled"
}

function task_state_create(task, contractInstance, account) {
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
                                        alert("Task state update to accepted")
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

function task_state_accept(task, contractInstance, account) {
    return (
        <div>
            <table>
                <tr>
                    <td>Header</td>
                    <td>Description</td>
                    <td>State</td>
                    <td>Requester</td>
                    <td>Worker</td>
                    <td>Salary</td>
                    <td>Requester proof of trust</td>
                    <td>Worker proof of trust</td>
                    <td>Done task</td>
                        </tr>
                        <tr>
                            <td>{ task.header }</td>
                            <td>{ task.description }</td>
                            <td>{ TaskState[task.state] }</td>
                            <td>{ task.requester } </td>
                            <td>{ task.worker }</td>
                            <td>{ task.salary / 1e18 } Eth</td>
                            <td>{ task.requesterProofOfTrust / 1e18 } Eth</td>
                            <td>{ task.workerProofOfTrust / 1e18 } Eth</td>
                            <td>
                                <form onSubmit={(event) => {
                                    event.preventDefault()
                                    contractInstance.methods.doneTask(task.taskAddr)
                                    .send({ from: account })
                                    .then(result => {
                                        alert("Task state updated to done")
                                        console.log(result)
                                    })
                                }}>
                            <input type='submit' value='Done task' />
                        </form>
                    </td>
                </tr>
            </table>
        </div> 
    )
}

function task_state_done(task, contractInstance, account) {
    return (
        <div>
            <table>
                <tr>
                    <td>Header</td>
                    <td>Description</td>
                    <td>State</td>
                    <td>Requester</td>
                    <td>Worker</td>
                    <td>Salary</td>
                    <td>Requester proof of trust</td>
                    <td>Worker proof of trust</td>
                    <td>Finish task</td>
                        </tr>
                        <tr>
                            <td>{ task.header }</td>
                            <td>{ task.description }</td>
                            <td>{ TaskState[task.state] }</td>
                            <td>{ task.requester } </td>
                            <td>{ task.worker }</td>
                            <td>{ task.salary / 1e18 } Eth</td>
                            <td>{ task.requesterProofOfTrust / 1e18 } Eth</td>
                            <td>{ task.workerProofOfTrust / 1e18 } Eth</td>
                            <td>
                                <form onSubmit={(event) => {
                                    event.preventDefault()
                                    contractInstance.methods.finishTask(task.taskAddr)
                                    .send({ from: account })
                                    .then(result => {
                                        alert("Task state updated to finished")
                                        console.log(result)
                                    })
                                }}>
                            <input type='submit' value='Done task' />
                        </form>
                    </td>
                </tr>
            </table>
        </div> 
    )
}

function task_state_finish(task) {
    return (
        <div>
            <table>
                <tr>
                    <td>Header</td>
                    <td>Description</td>
                    <td>State</td>
                    <td>Requester</td>
                    <td>Worker</td>
                    <td>Salary</td>
                    <td>Requester proof of trust</td>
                    <td>Worker proof of trust</td>
                        </tr>
                        <tr>
                            <td>{ task.header }</td>
                            <td>{ task.description }</td>
                            <td>{ TaskState[task.state] }</td>
                            <td>{ task.requester } </td>
                            <td>{ task.worker }</td>
                            <td>{ task.salary / 1e18 } Eth</td>
                            <td>{ task.requesterProofOfTrust / 1e18 } Eth</td>
                            <td>{ task.workerProofOfTrust / 1e18 } Eth</td>
                </tr>
            </table>
        </div> 
    )
}

function task_state_cancel(task) {
    return (
        <div>
            <table>
                <tr>
                    <td>Header</td>
                    <td>Description</td>
                    <td>State</td>
                    <td>Requester</td>
                    <td>Worker</td>
                    <td>Salary</td>
                    <td>Requester proof of trust</td>
                    <td>Worker proof of trust</td>
                        </tr>
                        <tr>
                            <td>{ task.header }</td>
                            <td>{ task.description }</td>
                            <td>{ TaskState[task.state] }</td>
                            <td>{ task.requester } </td>
                            <td>{ task.worker }</td>
                            <td>{ task.salary / 1e18 } Eth</td>
                            <td>{ task.requesterProofOfTrust / 1e18 } Eth</td>
                            <td>{ task.workerProofOfTrust / 1e18 } Eth</td>
                </tr>
            </table>
        </div> 
    )
}

const TaskTable = ({ task, contractInstance, account }) => {

    
    switch(task.state) {
        case "0": return task_state_create(task, contractInstance, account)
        case "1": return task_state_accept(task, contractInstance, account)
        case "2": return task_state_done(task, contractInstance, account)
        case "3": return task_state_finish(task)
        case "4": return task_state_cancel(task)
        default: return ( <p>Enter task address to see</p> ) 
    }
    

}

export default TaskTable;