import ethToWei from '../utils/valueConverter'
import { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'

const FundsManagement = ({ contractInstance, account }) => {

    const [funds, setFunds] = useState({actual: '0', locked: '0'})
    
    useEffect(() => {
        if(account !== '') {
            readFunds()
        }
    }, [account])

    function readFunds() {
        contractInstance.methods.ownerToFunds(account).call()
        .then(funds => {
            setFunds(funds)
        })
    }

    return (
        <div className='App'>
            <h3> Deposit & Withdraw funds </h3>
            
                <form className='m-1' onSubmit={event => {
                    event.preventDefault()
                    if(isFinite(event.target.depositFunds.value)) {
                        contractInstance.methods.deposit().send({ from: account, value: ethToWei(event.target.depositFunds.value) })
                        .then(response => {
                            readFunds()
                        })
                        console.log(`Transaction account: ${account} value: ${event.target.depositFunds.value}`)
                        event.target.depositFunds.value = ''
                        event.target.depositFunds.style.backgroundColor = ''
                    } else {
                        event.target.depositFunds.value = ''
                        event.target.depositFunds.style.backgroundColor = 'red'
                        event.target.depositFunds.placeholder = "Please enter a valid number"
                    }
                }}>
                    <input className='w-25' type='number' step='any' name="depositFunds" placeholder="funds" />
                    <input className='w-25 btn btn-secondary' type='submit' value="deposit"/>
                </form>
                <form className='m-1' onSubmit={event => {
                    event.preventDefault()
                    if(isFinite(event.target.withdrawFunds.value)) {
                        contractInstance.methods.withdraw((event.target.withdrawFunds.value * 1e18).toFixed()).send({ from: account })
                        .then(response => {
                            readFunds()
                        })
                        event.target.withdrawFunds.value = ''
                        event.target.withdrawFunds.style.backgroundColor = ''
                    } else {
                        event.target.withdrawFunds.value = ''
                        event.target.withdrawFunds.style.backgroundColor = 'red'
                        event.target.withdrawFunds.placeholder = "Please enter a valid number"
                    }
                }}>
                    <input className='w-25' type='number' step='any' name="withdrawFunds" placeholder="funds" />
                    <input className='w-25 btn btn-secondary' type='submit' value="withdraw"/>
                </form>
            <br /> 

                <h4>Actual Funds <span className='badge bg-info'> { funds.actual / 10**18 } Eth </span> </h4>
                <h4>Locked Funds <span className='badge bg-info'> { funds.locked / 10**18 } Eth </span> </h4>

            <br />
            <button className="btn btn-primary w-25 m-1">
                <Link className="text-white text-decoration-none h6" to='/'>Home</Link>
            </button><br></br>
            <button className="btn btn-primary w-25 m-1">
                <Link className="text-white text-decoration-none h6" to='/createTask'>Create New Task</Link>
            </button><br></br>
            <button className="btn btn-primary w-25 m-1">
                <Link className="text-white text-decoration-none h6" to='/manageTask'>Manage Task</Link>
            </button><br></br>
            <Outlet />
        </div>
    )
}

export default FundsManagement