import { Link, Outlet } from "react-router-dom";

const Home = () => {

    return (
        <>
            <h1>Welcome</h1>
            <p>Metamask wallet is installed</p>

            <ul>
                <li>
                    <Link to='/funds'>Manage funds</Link>
                    <Outlet />
                </li>
            </ul>

        </>

        
    )
}

export default Home;