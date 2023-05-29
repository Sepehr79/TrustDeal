const Strongbox = artifacts.require("./Strongbox")

contract("Strongbox", (accounts) => {

    let sepehr = accounts[0]
    let strongbox;

    beforeEach(async () => {
        strongbox = await Strongbox.new()
    })

    it("Should be able to deposit an amount of funds", async () => {
        const result = await strongbox.deposit({from: sepehr, value: 2 * 10 ** 18});
        assert.equal(result.receipt.status, true);
        const funds = await strongbox.ownerToFunds.call(sepehr);
        assert.equal(parseInt(funds.actual), 2 * 10 ** 18)
    })

    it("Should be able to withdraw an amount of funds", async () => {
        let initialBalance = await web3.eth.getBalance(sepehr)
        await strongbox.deposit({from: sepehr, value: 2e18.toFixed()});
        let fund = await strongbox.ownerToFunds(sepehr);
        assert.equal(parseInt(fund.actual), parseInt(2e18.toFixed()))

        await strongbox.withdraw(2e18.toFixed(), {from: sepehr});
        let accountBalance = await web3.eth.getBalance(sepehr);
        assert.isTrue(accountBalance / initialBalance  < 1)
    })

    // This test is disabled becuase lock and burn functions are internal and we cant call them outside of the contract
    xit("Should be able to burn token when amount is lower than locked value", async () => {
        await strongbox.deposit({from: sepehr, value: 5e18.toFixed()});
        await strongbox.lock(sepehr, 3e18.toFixed());
        let fund = await strongbox.ownerToFunds(sepehr);
        assert.equal(parseInt(fund.locked), parseInt(3e18.toFixed())); // 3 Eths locked

        await strongbox.burn(sepehr, 1e18.toFixed()); // 1 Eth burned
        let newFund = await strongbox.ownerToFunds(sepehr);
        assert.equal(parseInt(newFund.locked), parseInt(2e18.toFixed())); // 2 Locked eths remained
    })
})