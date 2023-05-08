import Web3 from "web3";

const web3js = new Web3();

const ethToWei = (ethers) => {
    return web3js.utils.toWei(ethers, "ether")
}


export default ethToWei