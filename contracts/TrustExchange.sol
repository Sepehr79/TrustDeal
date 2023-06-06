// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./Strongbox.sol";
import "./TaskNFT.sol";

contract TrustExchange is Strongbox {

    address private owner;
    TaskNFT private taskNft;

    constructor() {
        owner = msg.sender;
        taskNft = new TaskNFT();
    }

    event TaskStateChanged(address indexed sender, uint indexed taskAddr, TaskState newState);

    enum TaskState {
        CREATED_BY_REQUESTER,
        DONE_BY_WORKER,
        FINISH_BY_REQUESTER,
        CANCELED,
        REJECTED,
        UNFINISHED   
    }

    struct Task {
        uint taskAddr;
        TaskState state;

        address requester;
        uint salary;
        uint requesterProofOfTrust;
        uint requesterMinimumTrustValueForWorker;

        address worker;
        uint workerProofOfTrust;       
    }

    modifier CurrentTask(uint taskAddr, TaskState state) {
        require(tasks[taskAddr].state == state, "Task is not at the correct state for this process");
        _;
    }

    mapping (uint => Task) public tasks;

    function NFTaddress() public view returns (address) {
        return address(taskNft);
    }

    function createTask(
        uint _salary,
        uint _requesterProofOfTrust,
        uint _requesterMinimumTrustValueForWorker,
        address _dealer
        ) public {
            lock(msg.sender, _salary + _requesterProofOfTrust);

            Task memory task;
            task.state = TaskState.CREATED_BY_REQUESTER;
            task.requester = msg.sender;
            task.salary = _salary;
            task.requesterProofOfTrust = _requesterProofOfTrust;
            task.requesterMinimumTrustValueForWorker = _requesterMinimumTrustValueForWorker;
            task.taskAddr = uint(keccak256(abi.encodePacked(_salary, _requesterProofOfTrust, _requesterMinimumTrustValueForWorker, msg.sender, block.timestamp)));

            tasks[task.taskAddr] = task;
            taskNft.mint(_dealer, task.taskAddr);
            
            emit TaskStateChanged(msg.sender, task.taskAddr, task.state);
    }

    function doneTaskWithTrust(uint256 _taskAddr, uint _workerProofOfTrust) public CurrentTask(_taskAddr, TaskState.CREATED_BY_REQUESTER) {
        Task storage task = tasks[_taskAddr];
        require(task.requester != address(0x0));
        require(task.requesterMinimumTrustValueForWorker <= _workerProofOfTrust);
        require(taskNft.isApprovedOrOwner(msg.sender, _taskAddr));

        lock(msg.sender, _workerProofOfTrust);

        task.state = TaskState.DONE_BY_WORKER;
        task.worker = msg.sender;
        task.workerProofOfTrust = _workerProofOfTrust;
        emit TaskStateChanged(msg.sender, task.taskAddr, task.state);
    }

    function doneTask(uint256 _taskAddr) public {
        require(tasks[_taskAddr].worker == msg.sender, "Sender is not worker of the task");
        require(tasks[_taskAddr].state == TaskState.REJECTED, "Task is not at the correct state");
        tasks[_taskAddr].state = TaskState.DONE_BY_WORKER;
        emit TaskStateChanged(msg.sender, _taskAddr, tasks[_taskAddr].state);
    }

    function finishTask(uint256 _taskAddr) public CurrentTask(_taskAddr, TaskState.DONE_BY_WORKER) {
        require(tasks[_taskAddr].requester == msg.sender, "Sender is not requester of the task");

        Task storage task = tasks[_taskAddr];
        unlock(task.requester, task.salary + task.requesterProofOfTrust);
        unlock(task.worker, task.workerProofOfTrust);
        transfer(task.requester, task.worker, task.salary);
        task.state = TaskState.FINISH_BY_REQUESTER;
        taskNft.burn(task.taskAddr);
        emit TaskStateChanged(msg.sender, task.taskAddr, task.state);
    }

    function cancelTask(uint256 _taskAddr) public {
        Task storage task = tasks[_taskAddr];
        if (task.state == TaskState.CREATED_BY_REQUESTER) {
            require(msg.sender == task.requester, "Task doesnt exists with the requested address");    
            _cancelTask(task);
            emit TaskStateChanged(msg.sender, task.taskAddr, task.state);
        } else {
            revert("Task is not at the state CREATED");
        }
    }

    function _cancelTask(Task storage _task) private {
        unlock(_task.requester, _task.salary + _task.requesterProofOfTrust);
        _task.state = TaskState.CANCELED;
        taskNft.burn(_task.taskAddr);
    }

    function rejectTask(uint256 _taskAddr) public CurrentTask(_taskAddr, TaskState.DONE_BY_WORKER) {
        require(tasks[_taskAddr].requester == msg.sender, "Sender is not requester of the task");
        Task storage task = tasks[_taskAddr];
        task.state = TaskState.REJECTED;
        emit TaskStateChanged(msg.sender, task.taskAddr, task.state);
    }

    function unFinishTask(uint256 _taskAddr) public {
        Task storage task = tasks[_taskAddr];
        require(task.state == TaskState.REJECTED || task.state == TaskState.DONE_BY_WORKER, "Task is not at correct state");
        require(task.requester == msg.sender || task.worker == msg.sender, "Caller has not premission to finish this task");

        uint repaymentRate = calcRepaymentRate(task);

        uint requesterTaskLockedFund = task.salary + task.requesterProofOfTrust;
        uint workerTaskLockedFund = task.workerProofOfTrust;

        uint requesterBurnValue = requesterTaskLockedFund * repaymentRate / 100;
        uint workerBurnValue = workerTaskLockedFund * repaymentRate / 100;

        burn(task.requester, requesterBurnValue);
        burn(task.worker, workerBurnValue);
        unlock(task.requester, requesterTaskLockedFund - requesterBurnValue);
        unlock(task.worker, workerTaskLockedFund - workerBurnValue);

        task.state = TaskState.UNFINISHED;
        taskNft.burn(task.taskAddr);
        emit TaskStateChanged(msg.sender, task.taskAddr, task.state);
    }

    function calcRepaymentRate(Task memory task) internal pure returns (uint) {
        return (((task.salary + (task.requesterProofOfTrust / 4)) * 100) / (task.salary + task.requesterProofOfTrust));
    }

}