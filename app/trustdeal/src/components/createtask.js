import { useState } from "react";
import { Link } from "react-router-dom";


const CreateTask = ({ contractInstance, account }) => {

    const [taskAddr, setTaskAddr] = useState('')

    return (
        <>
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
                      })
                    .on("error", function(error) {
                        console.log(error)
                    });
                    
                }
            }}>
                <input type='text' name='header' placeholder="Task header" /><br />
                <input type='text' name='description' placeholder="Task description" /><br />
                <input type='number' step='any' name='salary' placeholder="Salary" /><br />
                <input type='number' step='any' name='proofOfTrust' placeholder="Proof of trust" /><br />
                <input type='number' step='any' name='workerProofOfTrust' placeholder="Worker proof of trust" /><br /> 
                <input type='Submit' value='Create' />                                               
            </form><br />
            <p> Task address is { taskAddr } </p>
            

            <Link to='/funds'>Manage funds</Link><br />
            <Link to='/'>Home</Link>
        </>
    )

}

export default CreateTask;