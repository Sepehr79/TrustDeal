import { Link, Outlet } from "react-router-dom";
import './home.css'

const Home = () => {

    return (
        <div className="App">
            <ul>
                <li>
                    <Link to='/funds'>Deposit & Withdraw Funds</Link>
                </li>
                <li>
                    <Link to='/createTask'>Create New Task</Link>
                </li>
                <li>
                    <Link to='/manageTask'>Manage Task</Link>
                </li>
            </ul>
            
            <Outlet />
        </ div>

        
    )
}

export default Home;