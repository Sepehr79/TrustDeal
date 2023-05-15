import { useState } from "react";
import { Link } from "react-router-dom";


const CreateTask = ({ contractInstance, account }) => {

    const [taskAddr, setTaskAddr] = useState('')

    return (
        <div>
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
                            
                            <input type='text' className="m-1 w-25" id='header' name='header' placeholder="Task header" /><br />
                            <textarea name='description' className="m-1 w-25" placeholder="Task description" /><br />
                            <input type='number' className="m-1 w-25" step='any' name='salary' placeholder="Salary" /><br />
                            <input type='number' className="m-1 w-25" step='any' name='proofOfTrust' placeholder="Proof of trust" /><br />
                            <input type='number' className="m-1 w-25" step='any' name='workerProofOfTrust' placeholder="Worker proof of trust" /><br /> 
                            <input type='Submit' className="m-1 w-25 btn btn-secondary" value='Create' />                                            
                    </form><br />
            { taskAddr !== '' ? <p> Task address: <span style={{color: "blue"}}> { taskAddr } </span> </p> : <p></p>  }


            <button className="btn btn-primary w-25 m-1">
                <Link className="text-white text-decoration-none h6" to='/'>Home</Link>
            </button><br></br>
            <button className="btn btn-primary w-25 m-1">
                <Link className="text-white text-decoration-none h6" to='/funds'>Manage Funds</Link>
            </button><br></br>
            <button className="btn btn-primary w-25 m-1">
                <Link className="text-white text-decoration-none h6" to='/manageTask'>Manage Task</Link>
            </button><br></br>
        </div>
    )

}

export default CreateTask;