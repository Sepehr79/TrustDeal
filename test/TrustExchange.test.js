const trustExchange = artifacts.require("./TrustExchange")

contract("TrustExchange", (accounts) => {
    let [worker, requester] = accounts
    let contractInstance;

    beforeEach(async () => {
        // Deploy contract to the test enviroment (ganache)
        contractInstance = await trustExchange.new()
    })

    it("Should work correctly with worker and requester", async () => {
        // Initial balance of all accounts is 100 ether at test enviroment
        // worker and requester charge their accounts with 10 ethers
        await contractInstance.deposit({from: requester, value: 10e18})
        await contractInstance.deposit({from: worker, value: 10e18})

        // requester creates new task
        const taskCreationResult = await contractInstance.createTask(
            5e18.toFixed(), // Salary
            3e18.toFixed(), // Requester proof of trust,
            3e18.toFixed(),  // Requester proof of trust for worker
            {from: requester}
        )

        assert.equal(taskCreationResult.receipt.status, true); // Check for success execution
        assert.equal(taskCreationResult.logs[0].args.newState, 0); // State of task is CREATED_BY_REQUESTER

        let fund = await contractInstance.ownerToFunds(requester); // Get funds of the requester after task creation
        assert.equal(parseInt(fund.actual), 2e18); 
        assert.equal(parseInt(fund.locked), 8e18);

        let taskAddress = taskCreationResult.logs[0].args.taskAddr; // get address of the task
        console.log(`Task address: ${taskAddress}`) 

        // Worker accepts the task
        const taskAcceptionResult = await contractInstance.acceptTask(
            taskAddress,
            3e18.toFixed(),
            {from: worker}
        ) 

        assert.equal(taskAcceptionResult.receipt.status, true);
        assert.equal(taskAcceptionResult.logs[0].args.newState, 1); // Task new state is ACCEPTED_BY_WORKER

        const taskDoneResult = await contractInstance.doneTask(
            taskAddress,
            {from: worker}
        )

        assert.equal(taskDoneResult.receipt.status, true);
        assert.equal(taskDoneResult.logs[0].args.newState, 2); // Task new state is DONE_BY_WORKER

        const taskFinishResult = await contractInstance.finishTask(
            taskAddress,
            {from: requester}
        )

        assert.equal(taskFinishResult.receipt.status, true);
        assert.equal(taskFinishResult.logs[0].args.newState, 3); // FINISHED_BY_REQUESTER

        
        const workerFunds = await contractInstance.ownerToFunds(worker);
        assert.equal(parseInt(workerFunds.actual), 15e18); // Worker actual funds is 15 ether
        assert.equal(parseInt(workerFunds.locked), 0);

        // Worker withdraws his funds
        await contractInstance.withdraw(
            15e18.toFixed(),
            {from: worker}
        )

        // check balance of worker account
        let workerBalance = (await web3.eth.getBalance(worker)) / 1e18;

        // worker new balance is about 105 ether, actual value is 
        // 104.98_; this is becuase of gas price
        console.log(`Worker balance: ${workerBalance}`)
        assert.isTrue(workerBalance < 105 && workerBalance > 104.5)
    })

    it("Should refund the amount of funds locked from the seller or customer when canceling", async () => {

        // Deposit fund
        await contractInstance.deposit({from: requester, value: 5e18})

        // Create new task
        const taskCreationResult = await contractInstance.createTask(
            2e18.toFixed(), // Salary
            2e18.toFixed(), // Requester proof of trust
            2e18.toFixed(),  
            {from: requester}
        )

        // Lock funds
        let lockedFund = await contractInstance.ownerToFunds(requester);
        assert.equal(parseInt(lockedFund.actual), 1e18);  
        assert.equal(parseInt(lockedFund.locked), 4e18); // Locked funds
        let taskAddress = taskCreationResult.logs[0].args.taskAddr;

        // Cancel task
        let taskCancelResult = await contractInstance.cancelTask(taskAddress, {from: requester}); // Cancel the task
        assert.equal(taskCancelResult.logs[0].args.newState, 4); // Task state is CANCELED

        // Unlock funds
        let unlockedFund = await contractInstance.ownerToFunds(requester);
        assert.equal(parseInt(unlockedFund.actual), 5e18); 

    })

    it("Should revert when salary plus proof is higher than funds", async () => {
        await contractInstance.deposit({from: requester, value: 4e18})

        try {
            await contractInstance.createTask(
                2e18.toFixed(), // Salary
                3e18.toFixed(), // Requester proof of trust 
                2e18.toFixed(),  
                {from: requester}
            ) // 2 + 3 ethers is higher than 4 funds
            assert.fail()
        } catch (error) {
            assert.equal(error.data.message, "revert")
            assert.equal(error.reason, "There is no enough actual fund for this owner")
        }
        

    })


})