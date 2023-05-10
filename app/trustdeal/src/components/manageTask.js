import { Link } from "react-router-dom"


const ManageTask = ({ contractInstance, account }) => {

    return (
        <div>
            <ul>
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/createTask'>Create new task</Link></li>
                <li><Link to='/funds'>Funds</Link></li>
            </ul>
        </div>
    )
}

export default ManageTask