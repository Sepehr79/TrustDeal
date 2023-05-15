import { MetaMaskSDK } from '@metamask/sdk'
import Web3 from "web3";
import { useState } from 'react';
import FundsManagement from './components/Depositfunds';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/home';
import CreateTask from './components/createtask';
import ManageTask from './components/manageTask';
import 'bootstrap/dist/css/bootstrap.css';


const options = {
  injectProvider: false,
  communicationLayerPreference: 'webrtc',
};
const sdk = new MetaMaskSDK(options);
const provider = sdk.getProvider()
let web3js = new Web3(provider)
const contractABI = require('./TrustExchange.json').abi
const contractAddress = '0xab9D4895db3246F178A032893746172d6532b41a'


function App() {
  const [account, setAccount] = useState('')

  if (provider.isMetaMask) {
    window.ethereum.enable()
    web3js.eth.getAccounts()
    .then(accounts => { setAccount(accounts[0]) })
  

    window.ethereum.on('accountsChanged', function (accounts) {
      setAccount(accounts[0])
    })
 
    let contractInstance = new web3js.eth.Contract(contractABI, contractAddress)

    return (
      <div>
        <div className='container-fluid p-5 text-black text-center'>
            <h1 className='display-3'>TrustExchange</h1>
        </div>
        <div className='container-fluid text-center'>
          <BrowserRouter>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/funds' element={<FundsManagement contractInstance={contractInstance} account={account} />} />
                <Route path='/createTask' element={<CreateTask contractInstance={contractInstance} account={account} />} />
                <Route path='/manageTask' element={<ManageTask contractInstance={contractInstance} account={account} />} />
              </Routes>
            </BrowserRouter>
          </div>
      </div>
    );
  } else {
    return (
        <h1>Please install metamask wallet</h1>
    )
  }
}

export default App;
