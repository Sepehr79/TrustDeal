import { Link, Outlet } from "react-router-dom";
import './home.css'

const Home = () => {

    return (
        <div>
            
            <button className="btn btn-primary w-25 m-1">
                <Link className="text-white text-decoration-none h6" to='/funds'>Deposit & Withdraw Funds</Link>
            </button><br></br>
            <button className="btn btn-primary w-25 m-1">
                <Link className="text-white text-decoration-none h6" to='/createTask'>Create New Task</Link>
            </button><br></br>
            <button className="btn btn-primary w-25 m-1">
                <Link className="text-white text-decoration-none h6" to='/manageTask'>Manage Task</Link>
            </button><br></br>
            
            
            <Outlet />
        </ div>

        
    )
}

export default Home;