import { Component, useState } from "react";
import { Link } from "react-router-dom";
import './createtask.css'


const CreateTask = ({ contractInstance, account }) => {

    const [taskAddr, setTaskAddr] = useState('')

    return (
        <div className="App">
            <h3>Create new task</h3>
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

            <Link to='/funds'>Manage funds</Link><br />
            <Link to='/'>Home</Link>
        </div>
    )

}

export default CreateTask;