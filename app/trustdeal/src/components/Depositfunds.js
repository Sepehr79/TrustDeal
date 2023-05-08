import './Depositfunds.css'
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
            <label>
                <form onSubmit={event => {
                    event.preventDefault()
                    if(isFinite(event.target.depositFunds.value)) {
                        contractInstance.methods.deposit().send({ from: account, value: ethToWei(event.target.depositFunds.value) })
                        console.log(`Transaction account: ${account} value: ${event.target.depositFunds.value}`)
                        event.target.depositFunds.value = ''
                        event.target.depositFunds.style.backgroundColor = ''
                        setInterval(readFunds, 5000)
                    } else {
                        event.target.depositFunds.value = ''
                        event.target.depositFunds.style.backgroundColor = 'red'
                        event.target.depositFunds.placeholder = "Please enter a valid number"
                    }
                }}>
                    <input type='number' step='any' name="depositFunds" placeholder="funds" />
                    <input type='submit' value="deposit"/>
                </form>
            </label>
            <label>
                <form onSubmit={event => {
                    event.preventDefault()
                    if(isFinite(event.target.withdrawFunds.value)) {
                        contractInstance.methods.withdraw((event.target.withdrawFunds.value * 1e18).toFixed()).send({ from: account })
                        event.target.withdrawFunds.value = ''
                        event.target.withdrawFunds.style.backgroundColor = ''
                        setInterval(readFunds, 5000)
                    } else {
                        event.target.withdrawFunds.value = ''
                        event.target.withdrawFunds.style.backgroundColor = 'red'
                        event.target.withdrawFunds.placeholder = "Please enter a valid number"
                    }
                }}>
                    <input type='number' step='any' name="withdrawFunds" placeholder="funds" />
                    <input type='submit' value="withdraw"/>
                </form>
            </label>
            <p>Actual funds: { funds.actual / 10**18 } eth </p>
            <p>Locked funds: { funds.locked / 10**18 } eth </p>


            <Link to='/'>Home</Link>
            <Outlet />
        </div>
    )
}

export default FundsManagement