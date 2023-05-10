import { Link, Outlet } from "react-router-dom";
import './home.css'

const Home = () => {

    return (
        <div className="App">
            <h1>Welcome</h1>
            <p>Metamask wallet is installed</p>

            <p>
                <Link to='/funds'>Manage funds</Link> <br />
            </p>
            <p>
                <Link to='/createTask'>Create new task</Link>
            </p>
            <p>
                <Link to='/manageTask'>Manage task</Link>
            </p>
            

            <Outlet />
        </ div>

        
    )
}

export default Home;