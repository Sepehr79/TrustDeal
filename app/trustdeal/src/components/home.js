import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";

const Home = ( { contractInstance }) => {

    const [address, setAddress] = useState('0');

    useEffect(() => {
        readNftAdrress();
    }, [])

    function readNftAdrress() {
        contractInstance.methods.NFTaddress().call()
            .then(address => {
                setAddress(address);
            })
    }

    return (
        <div>
            
            <h3>Home</h3><br />
            {/* <p>NFT address: { address }</p> */}
            <button className="btn btn-primary w-25 m-1">
                <Link className="text-white text-decoration-none h6" to='/funds'>Deposit & Withdraw Funds</Link>
            </button><br></br>
            <button className="btn btn-primary w-25 m-1">
                <Link className="text-white text-decoration-none h6" to='/createTask'>Create New Task</Link>
            </button><br></br>
            <button className="btn btn-primary w-25 m-1">
                <Link className="text-white text-decoration-none h6" to='/manageTask'>Manage Task</Link>
            </button><br></br>
            <button className="btn btn-primary w-25 m-1">
                <Link className="text-white text-decoration-none h6" to='/workers'>Workers</Link>
            </button><br></br>
            
            
            <Outlet />
        </ div>

        
    )
}

export default Home;