const TaskState = {
    "0": "Unassigned",
    "1": "Verify",
    "2": "Finished",
    "3": "Removed",
    "4": "Rejected"
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
                <td>Worker</td>
                        <td>
                            <form onSubmit={(event) => {
                                        event.preventDefault()
                                        contractInstance.methods.setDealer(event.target.worker.value, task.taskAddr)
                                        .send({ from: account })
                                        .then(result => {
                                            alert("Task worker updated")
                                            submitClick()
                                            console.log(result)
                                        })
                                    }}>
                                <input type='text' name="worker" id="worker" defaultValue={ task.worker } />
                                <input disabled={task.requester != account} type='submit' value='Update worker' />
                            </form>
                        </td>
                </tr>
                <tr>
                    <td>
                        Salary
                    </td>
                    <td>
                            <form onSubmit={(event) => {
                                        event.preventDefault()
                                        contractInstance.methods.setSalary(
                                            task.taskAddr,
                                            (event.target.salary.value * 1e18).toFixed()
                                        )
                                        .send({ from: account })
                                        .then(result => {
                                            alert("Task salary updated")
                                            submitClick()
                                            console.log(result)
                                        })
                                    }}>
                                <input type='number' step='any' name="salary" id="salary" defaultValue={ task.salary / 1e18 } />
                                <input type='submit' disabled={task.requester != account} value='Update salary' />
                            </form>
                        </td>
                </tr>
                <tr>
                <td>Proof of trust</td>
                <td>
                            <form onSubmit={(event) => {
                                        event.preventDefault()
                                        contractInstance.methods.setProofOfTrust(
                                            task.taskAddr,
                                            (event.target.requesterProofOfTrust.value * 1e18).toFixed()
                                        )
                                        .send({ from: account })
                                        .then(result => {
                                            alert("Task requesterProofOfTrust updated")
                                            submitClick()
                                            console.log(result)
                                        })
                                    }}>
                                <input type='number' step='any' name="requesterProofOfTrust" id="requesterProofOfTrust" defaultValue={ task.requesterProofOfTrust / 1e18 } />
                                <input type='submit' disabled={task.requester != account} value='Update requesterProofOfTrust' />
                            </form>
                        </td>
                </tr>
                <tr>
                    <td>
                        Minimum proof of trust for worker
                    </td>
                    <td>
                            <form onSubmit={(event) => {
                                        event.preventDefault()
                                        contractInstance.methods.setMinimumTrustForWorker(
                                            task.taskAddr,
                                            (event.target.workerProofOfTrust.value * 1e18).toFixed()
                                        )
                                        .send({ from: account })
                                        .then(result => {
                                            alert("Task requesterProofOfTrust updated")
                                            submitClick()
                                            console.log(result)
                                        })
                                    }}>
                                <input type='number' step='any' name="workerProofOfTrust" id="workerProofOfTrust" defaultValue={ task.requesterMinimumTrustValueForWorker / 1e18 } />
                                <input type='submit' disabled={task.requester != account} value='Update workerProofOfTrust' />
                            </form>
                        </td>
                </tr>
                <tr>
                    <td>Do task</td>
                    <td>
                        <form onSubmit={(event) => {
                                    event.preventDefault()
                                    contractInstance.methods.doneTaskWithTrust(task.taskAddr, (event.target.proofOfTrust.value * 1e18).toFixed())
                                    .send({ from: account })
                                    .then(result => {
                                        alert("Task state update to accepted")
                                        submitClick()
                                        console.log(result)
                                    })
                                }}>
                                    <input type='number' name='proofOfTrust' step='any' placeholder='Prove your trust!' />
                                    <input type='submit' value='Do task' />
                                </form>
                    </td>
                </tr>
                <tr>
                <td>Remove task</td>
                <td>
                    <button onClick={event => {
                                    contractInstance.methods.cancelTask(task.taskAddr).send({ from: account })
                                    .then(result => {
                                        alert("Task canceled")
                                        submitClick()
                                    })
                    }}>Remove</button>
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
                        <td>
                        { task.worker }
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Salary
                        </td>
                        <td>
                        { task.salary / 1e18 }
                        </td>
                    </tr>
                    <tr>
                        <td>Proof of trust</td>
                        <td>
                        { task.requesterProofOfTrust / 1e18 }
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Worker proof of trust
                        </td>
                        <td>
                        { task.workerProofOfTrust / 1e18 }
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
                                        .then(result => {
                                            fetch("http://localhost:8080/taskReviews",
                                            {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify(
                                                    {
                                                        
                                                        "userAddress": task.worker,
                                                        "taskAddress": task.taskAddr,
                                                        "taskState": "FINISHED"

                                                    })
                                            })
                                            .then(response => { response.json() })
                                            .then(result => {
                                                console.log(`POST request sent with account ${account}`)
                                            })
                                        })
                                    }}>
                                <input type='submit' value='Finish task' />
                            </form>
                        </td>
                    </tr>
                    <tr>
                        <td>Reject task</td>
                        <td>
                            <button onClick={event => {
                                            contractInstance.methods.rejectTask(task.taskAddr).send({ from: account })
                                            .then(result => {
                                                alert("Task rejected")
                                                submitClick()
                                            })
                            }}>Reject</button>
                        </td>
                    </tr>
                    {/* <tr>
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
                    </tr> */}
                    <tr>
                        <td>Reassign task</td>
                        <td>
                        <button onClick={event => {
                                            contractInstance.methods.unFinishTask(task.taskAddr).send({ from: account })
                                            .then(result => {
                                                alert("Task unfinished")
                                                submitClick()
                                            }).then(result => {
                                                fetch("http://localhost:8080/taskReviews",
                                                {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            
                                                            "userAddress": task.worker,
                                                            "taskAddress": task.taskAddr,
                                                            "taskState": "REASSIGNED"
    
                                                        })
                                                })
                                                .then(response => { response.json() })
                                            })
                            }}>Reassign</button>
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

function task_state_rejected(task, contractInstance, account, submitClick) {
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
                    <td>Reassign task</td>
                    <td>
                    <button onClick={event => {
                                            contractInstance.methods.unFinishTask(task.taskAddr).send({ from: account })
                                            .then(result => {
                                                alert("Task unfinished")
                                                submitClick()
                                            }).then(result => {
                                                fetch("http://localhost:8080/taskReviews",
                                                {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            
                                                            "userAddress": task.worker,
                                                            "taskAddress": task.taskAddr,
                                                            "taskState": "REASSIGNED"
    
                                                        })
                                                })
                                                .then(response => { response.json() })
                                            })
                            }}>Unfinish</button>
                    </td>
                </tr>
            </table>
        </div> 
    )
}


const TaskTable = ({ task, contractInstance, account, submitClick }) => {

    
    switch(task.state) {
        case "0": return task_state_create(task, contractInstance, account, submitClick)
        case "1": return task_state_done(task, contractInstance, account, submitClick)
        case "2": return task_state_finish(task)
        case "3": return task_state_cancel(task)
        case "4": return task_state_rejected(task, contractInstance, account, submitClick)
        default: return ( "" ) 
    }
    

}

export default TaskTable;