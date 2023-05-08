const Strongbox = artifacts.require("./Strongbox")

module.exports = function(deployer) {
    deployer.deploy(Strongbox)
}