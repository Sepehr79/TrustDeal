const TrustExchange = artifacts.require("./TrustExchange")

module.exports = function(deployer) {
    deployer.deploy(TrustExchange)
}