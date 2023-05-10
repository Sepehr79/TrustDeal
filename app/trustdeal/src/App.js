import { MetaMaskSDK } from '@metamask/sdk'
import Web3 from "web3";
import { useEffect, useState } from 'react';
import FundsManagement from './components/Depositfunds';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/home';
import CreateTask from './components/createtask';
import ManageTask from './components/manageTask';

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
  useEffect(()=> {
    web3js.eth.getAccounts()
      .then(accounts => {
        setAccount(accounts[0])
      })
  })

  if (provider.isMetaMask) {
    window.ethereum.enable();    
    let contractInstance = new web3js.eth.Contract(contractABI, contractAddress)

    return (
      <>
        <h1>TrustExchange</h1>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/funds' element={<FundsManagement contractInstance={contractInstance} account={account} />} />
            <Route path='/createTask' element={<CreateTask contractInstance={contractInstance} account={account} />} />
            <Route path='/manageTask' element={<ManageTask contractInstance={contractInstance} account={account} />} />
          </Routes>
        </BrowserRouter>
      </>
    );
  } else {
    return (
        <h1>Please install metamask wallet</h1>
    )
  }
}

export default App;
