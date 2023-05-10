import { Component, useState } from "react";
import { Link } from "react-router-dom";
import './createtask.css'


const CreateTask = ({ contractInstance, account }) => {

    const [taskAddr, setTaskAddr] = useState('')

    return (
        <div className="App">
            <h3>Create New Task</h3>
            <form onSubmit={event => {
                event.preventDefault()
                if(isFinite(event.target.salary.value) && isFinite(event.target.proofOfTrust.value) && isFinite(event.target.workerProofOfTrust.value)) {
                    contractInstance.methods.createTask(
                        (event.target.salary.value * 1e18).toFixed(),
                        (event.target.proofOfTrust.value * 1e18).toFixed(),
                        (event.target.workerProofOfTrust.value * 1e18).toFixed()
                    ).send({ from: account })
                    .on("receipt", function(receipt) {
                        setTaskAddr(receipt.events.TaskStateChanged.returnValues.taskAddr)
                        
                        fetch(
                            'http://localhost:8080/tasks',
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(
                                    {
                                        "id": receipt.events.TaskStateChanged.returnValues.taskAddr,
                                        "header": event.target.header.value,
                                        "description": event.target.description.value
                                    }
                                )
                            }
                        ).then(response => { response.json() })
                      })
                    .on("error", function(error) {
                        console.log(error)
                    });
                    
                }
            }}>
                <input className="Input" type='text' name='header' placeholder="Task header" /><br />
                <input className="Input" type='text' name='description' placeholder="Task description" /><br />
                <input className="Input" type='number' step='any' name='salary' placeholder="Salary" /><br />
                <input className="Input" type='number' step='any' name='proofOfTrust' placeholder="Proof of trust" /><br />
                <input className="Input" type='number' step='any' name='workerProofOfTrust' placeholder="Worker proof of trust" /><br /> 
                <input className="Input" type='Submit' value='Create' />                                               
            </form><br />
            { taskAddr !== '' ? <p> Task address is { taskAddr } </p> : <p></p>  }

            <ul>
                <li>
                    <Link to='/'>Home</Link>
                </li>
                <li>
                    <Link to='/funds'>Manage Funds</Link>
                </li>
                <li>
                    <Link to='/manageTask'>Manage Task</Link>
                </li>
            </ul>
        </div>
    )

}

export default CreateTask;