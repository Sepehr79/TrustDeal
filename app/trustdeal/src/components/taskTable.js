const TaskState = {
    "0": "Created",
    "1": "Accepted",
    "2": "Done",
    "3": "Finished",
    "4": "Canceled"
}

function task_state_create(task, contractInstance, account, submitClick) {
    return (
        <div>
            <table className="table table-bordered table-striped">
                <tr>
                    <td>Header</td>
                    <td>{ task.header }</td>
                </tr>
                <tr>
                    <td>
                        Description
                    </td>
                    <td>
                        { task.description }
                    </td>
                </tr>
                <tr>
                    <td>
                        State
                    </td>
                    <td>
                        { TaskState[task.state] }
                    </td>
                </tr>
                <tr>
                    <td>
                        Requester
                    </td>
                    <td>
                        { task.requester }
                    </td>
                </tr>
                <tr>
                    <td>
                        Salary
                    </td>
                    <td>
                        { task.salary / 1e18 } Eth
                    </td>
                </tr>
                <tr>
                <td>Proof of trust</td>
                    <td>{ task.requesterProofOfTrust / 1e18 } Eth</td>
                </tr>
                <tr>
                    <td>
                        Minimum proof of trust for worker
                    </td>
                    <td>
                        { task.requesterMinimumTrustValueForWorker / 1e18 } Eth
                    </td>
                </tr>
                <tr>
                    <td>Accept task</td>
                    <td>
                        <form onSubmit={(event) => {
                                    event.preventDefault()
                                    contractInstance.methods.acceptTask(task.taskAddr, (event.target.proofOfTrust.value * 1e18).toFixed())
                                    .send({ from: account })
                                    .then(result => {
                                        alert("Task state update to accepted")
                                        submitClick()
                                        console.log(result)
                                    })
                                }}>
                                    <input type='number' name='proofOfTrust' step='any' placeholder='Prove your trust!' />
                                    <input type='submit' value='Accept task' />
                                </form>
                    </td>
                </tr>
                <tr>
                <td>Cancel task</td>
                <td>
                    <button onClick={event => {
                                    contractInstance.methods.cancelTask(task.taskAddr).send({ from: account })
                                    .then(result => {
                                        alert("Task canceled")
                                        submitClick()
                                    })
                    }}>Cancel</button>
                </td>
                </tr>
            </table>
        </div> 
    )
}

function task_state_accept(task, contractInstance, account, submitClick) {
    return (
        <div>
            <table className="table table-bordered text-center">
            <tr>
                    <td>Header</td>
                    <td>{ task.header }</td>
                </tr>
                <tr>
                    <td>
                        Description
                    </td>
                    <td>
                        { task.description }
                    </td>
                </tr>
                <tr>
                    <td>
                        State
                    </td>
                    <td>
                        { TaskState[task.state] }
                    </td>
                </tr>
                <tr>
                    <td>
                        Requester
                    </td>
                    <td>
                        { task.requester }
                    </td>
                </tr>
                <tr>
                    <td>Worker</td>
                    <td>{ task.worker }</td>
                </tr>
                <tr>
                    <td>
                        Salary
                    </td>
                    <td>
                        { task.salary / 1e18 } Eth
                    </td>
                </tr>
                <tr>
                    <td>Proof of trust</td>
                    <td>{ task.requesterProofOfTrust / 1e18 } Eth</td>
                </tr>
                <tr>
                    <td>
                       Worker proof of trust
                    </td>
                    <td>
                        { task.workerProofOfTrust / 1e18 } Eth
                    </td>
                </tr>
                <tr>
                    <td>    
                        Done task
                    </td>
                    <td>
                    <form onSubmit={(event) => {
                                    event.preventDefault()
                                    contractInstance.methods.doneTask(task.taskAddr)
                                    .send({ from: account })
                                    .then(result => {
                                        alert("Task state updated to done")
                                        submitClick()
                                        console.log(result)
                                    })
                                }}>
                            <input type='submit' value='Done task' />
                        </form>
                    </td>
                </tr>
                <tr>
                    <td>
                        Cancel task
                    </td>
                    <td>
                    <button onClick={event => {
                                    contractInstance.methods.cancelTask(task.taskAddr).send({ from: account })
                                    .then(result => {
                                        alert("Task canceled")
                                        submitClick()
                                    })
                    }}>Cancel</button>
                    </td>
                </tr>
            </table>
        </div> 
    )
}

function task_state_done(task, contractInstance, account, submitClick) {
    return (
        <div>
            <table className='table table-bordered'>
                <tr>
                        <td>Header</td>
                        <td>{ task.header }</td>
                    </tr>
                    <tr>
                        <td>
                            Description
                        </td>
                        <td>
                            { task.description }
                        </td>
                    </tr>
                    <tr>
                        <td>
                            State
                        </td>
                        <td>
                            { TaskState[task.state] }
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Requester
                        </td>
                        <td>
                            { task.requester }
                        </td>
                    </tr>
                    <tr>
                        <td>Worker</td>
                        <td>{ task.worker }</td>
                    </tr>
                    <tr>
                        <td>
                            Salary
                        </td>
                        <td>
                            { task.salary / 1e18 } Eth
                        </td>
                    </tr>
                    <tr>
                        <td>Proof of trust</td>
                        <td>{ task.requesterProofOfTrust / 1e18 } Eth</td>
                    </tr>
                    <tr>
                        <td>
                        Worker proof of trust
                        </td>
                        <td>
                            { task.workerProofOfTrust / 1e18 } Eth
                        </td>
                    </tr>
                    <tr>
                        <td>    
                            Finish task
                        </td>
                        <td>
                        <form onSubmit={(event) => {
                                        event.preventDefault()
                                        contractInstance.methods.finishTask(task.taskAddr)
                                        .send({ from: account })
                                        .then(result => {
                                            alert("Task state updated to finished")
                                            submitClick()
                                            console.log(result)
                                        })
                                    }}>
                                <input type='submit' value='Finish task' />
                            </form>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Cancel task
                        </td>
                        <td>
                        <button onClick={event => {
                                        contractInstance.methods.cancelTask(task.taskAddr).send({ from: account })
                                        .then(result => {
                                            alert("Task canceled")
                                            submitClick()
                                        })
                        }}>Cancel</button>
                        </td>
                    </tr>
            </table>
        </div> 
    )
}

function task_state_finish(task) {
    return (
        <div>
            <table className='table table-bordered'>
            <tr>
                        <td>Header</td>
                        <td>{ task.header }</td>
                    </tr>
                    <tr>
                        <td>
                            Description
                        </td>
                        <td>
                            { task.description }
                        </td>
                    </tr>
                    <tr>
                        <td>
                            State
                        </td>
                        <td>
                            { TaskState[task.state] }
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Requester
                        </td>
                        <td>
                            { task.requester }
                        </td>
                    </tr>
                    <tr>
                        <td>Worker</td>
                        <td>{ task.worker }</td>
                    </tr>
                    <tr>
                        <td>
                            Salary
                        </td>
                        <td>
                            { task.salary / 1e18 } Eth
                        </td>
                    </tr>
                    <tr>
                        <td>Proof of trust</td>
                        <td>{ task.requesterProofOfTrust / 1e18 } Eth</td>
                    </tr>
                    <tr>
                        <td>
                        Worker proof of trust
                        </td>
                        <td>
                            { task.workerProofOfTrust / 1e18 } Eth
                        </td>
                    </tr>
            </table>
        </div> 
    )
}

function task_state_cancel(task) {
    return (
        <div>
            <table className='table table-bordered'>
            <tr>
                        <td>Header</td>
                        <td>{ task.header }</td>
                    </tr>
                    <tr>
                        <td>
                            Description
                        </td>
                        <td>
                            { task.description }
                        </td>
                    </tr>
                    <tr>
                        <td>
                            State
                        </td>
                        <td>
                            { TaskState[task.state] }
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Requester
                        </td>
                        <td>
                            { task.requester }
                        </td>
                    </tr>
                    <tr>
                        <td>Worker</td>
                        <td>{ task.worker }</td>
                    </tr>
                    <tr>
                        <td>
                            Salary
                        </td>
                        <td>
                            { task.salary / 1e18 } Eth
                        </td>
                    </tr>
                    <tr>
                        <td>Proof of trust</td>
                        <td>{ task.requesterProofOfTrust / 1e18 } Eth</td>
                    </tr>
                    <tr>
                        <td>
                        Worker proof of trust
                        </td>
                        <td>
                            { task.workerProofOfTrust / 1e18 } Eth
                        </td>
                    </tr>
            </table>
        </div> 
    )
}

const TaskTable = ({ task, contractInstance, account, submitClick }) => {

    
    switch(task.state) {
        case "0": return task_state_create(task, contractInstance, account, submitClick)
        case "1": return task_state_accept(task, contractInstance, account, submitClick)
        case "2": return task_state_done(task, contractInstance, account, submitClick)
        case "3": return task_state_finish(task)
        case "4": return task_state_cancel(task)
        default: return ( "" ) 
    }
    

}

export default TaskTable;