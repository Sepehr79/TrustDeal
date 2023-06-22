import { useState } from "react";

const Workers = ({ account }) => {

    const [workers, setWorkers] = useState([])

    return (
    <>
        <form onSubmit={event => {
                        event.preventDefault()
                        fetch(`http://localhost:8080/taskReviews/search/findByUserAddress?userAddress=${event.target.address.value}`, {
                            method: 'get',
                            headers: {
                                "content-type": "application/json"
                            }
                        })
                        .then(response => {
                            response.json().then(result => {
                                setWorkers(result._embedded.taskReviews)
                                console.log(result)
                            })
                        })

                    }}>
                            
                            <input type='text' className="m-1 w-25" id='address' name='address' placeholder="Worker address" /><br />
                            <input type='Submit' className="m-1 w-25 btn btn-secondary" value='Search' />                                            
                    </form><br />
        
        <table className="table table-bordered text-center">
        {
            workers.map(worker => (
                <>
                    <tr>
                        <td>
                            Task address
                        </td>
                        <td>
                            { worker.taskAddress }
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Last update
                        </td>
                        <td>
                            { worker.date }
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Task state
                        </td>
                        <td style={{color: worker.taskState === 'FINISHED' ? 'green' : 'red'}}>
                            { worker.taskState }
                        </td>
                    </tr>
                </>
            ))
        }
        </table>
        
    </>
    )

}

export default Workers