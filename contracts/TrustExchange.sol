// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./Strongbox.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TrustExchange is Strongbox {

    constructor() {
        
    }

    event TaskStateChanged(address indexed sender, uint indexed taskAddr, TaskState newState);

    enum TaskState {
        UNASSIGNED_TASK,
        ASSIGNED_TASK,
        VERIFY_TASK,
        FINISHED_TASK,
        REMOVED_TASK   
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

    using Counters for Counters.Counter;
    Counters.Counter private _taskIds;


    function setDealer(address _to, uint256 _taskAddr) public CurrentTask(_taskAddr, TaskState.UNASSIGNED_TASK) {
        Task storage task = tasks[_taskAddr];
        require(msg.sender == task.requester);
        task.worker = _to;
    }

    function setSalary(uint _taskAddr, uint _salary) public CurrentTask(_taskAddr, TaskState.UNASSIGNED_TASK) {
        Task storage task = tasks[_taskAddr];
        require(msg.sender == task.requester);

        if(_salary > task.salary) {
            lock(msg.sender, _salary - task.salary);
        } else if (_salary < task.salary) {
            unlock(msg.sender, task.salary - _salary);
        }
        task.salary = _salary;
    }

    function setProofOfTrust(uint _taskAddr, uint _proof) public CurrentTask(_taskAddr, TaskState.UNASSIGNED_TASK) {
        Task storage task = tasks[_taskAddr];
        require(msg.sender == task.requester);

        if(_proof > task.requesterProofOfTrust) {
            lock(msg.sender, _proof - task.requesterProofOfTrust);
        } else if (_proof < task.requesterProofOfTrust) {
            unlock(msg.sender, task.requesterProofOfTrust - _proof);
        }
        task.requesterProofOfTrust = _proof;
    }

    function setMinimumTrustForWorker(uint _taskAddr, uint _proof) public CurrentTask(_taskAddr, TaskState.UNASSIGNED_TASK) {
        Task storage task = tasks[_taskAddr];
        require(msg.sender == task.requester);
        task.requesterMinimumTrustValueForWorker = _proof;
    }

    function createTask(
        uint _salary,
        uint _requesterProofOfTrust,
        uint _requesterMinimumTrustValueForWorker,
        address _dealer
        ) public {
            lock(msg.sender, _salary + _requesterProofOfTrust);

            Task memory task;
            task.state = TaskState.UNASSIGNED_TASK;
            task.requester = msg.sender;
            task.salary = _salary;
            task.requesterProofOfTrust = _requesterProofOfTrust;
            task.requesterMinimumTrustValueForWorker = _requesterMinimumTrustValueForWorker;

            task.taskAddr = _taskIds.current();
            task.worker = _dealer;
            _taskIds.increment();

            tasks[task.taskAddr] = task;
            
            emit TaskStateChanged(msg.sender, task.taskAddr, task.state);
    }

    function acceptTask(uint256 _taskAddr, uint _workerProofOfTrust) public CurrentTask(_taskAddr, TaskState.UNASSIGNED_TASK) {
        Task storage task = tasks[_taskAddr];
        require(task.requester != address(0x0));
        require(task.requesterMinimumTrustValueForWorker <= _workerProofOfTrust);
        require(task.worker == msg.sender, "Sender is not worker of the task");

        lock(msg.sender, _workerProofOfTrust);

        task.state = TaskState.ASSIGNED_TASK;

        task.workerProofOfTrust = _workerProofOfTrust;
        emit TaskStateChanged(msg.sender, task.taskAddr, task.state);
    }

    function doTask(uint256 _taskAddr) public {
        require(tasks[_taskAddr].worker == msg.sender, "Sender is not worker of the task");
        require(tasks[_taskAddr].state == TaskState.ASSIGNED_TASK, "Task is not at the correct state");
        tasks[_taskAddr].state = TaskState.VERIFY_TASK;
        emit TaskStateChanged(msg.sender, _taskAddr, tasks[_taskAddr].state);
    }

    function finishTask(uint256 _taskAddr) public CurrentTask(_taskAddr, TaskState.VERIFY_TASK) {
        require(tasks[_taskAddr].requester == msg.sender, "Sender is not requester of the task");

        Task storage task = tasks[_taskAddr];
        unlock(task.requester, task.salary + task.requesterProofOfTrust);
        unlock(task.worker, task.workerProofOfTrust);
        transfer(task.requester, task.worker, task.salary);
        task.state = TaskState.FINISHED_TASK;
        emit TaskStateChanged(msg.sender, task.taskAddr, task.state);
    }

    function removeTask(uint256 _taskAddr) public {
        Task storage task = tasks[_taskAddr];
        if (task.state == TaskState.UNASSIGNED_TASK) {
            require(msg.sender == task.requester, "Task doesnt exists with the requested address");    
            _removeTask(task);
            emit TaskStateChanged(msg.sender, task.taskAddr, task.state);
        } else {
            revert("Task is not at the state UNASSIGNED_TASK");
        }
    }

    function _removeTask(Task storage _task) private {
        unlock(_task.requester, _task.salary + _task.requesterProofOfTrust);
        _task.state = TaskState.REMOVED_TASK;
    }

    function rejectTask(uint256 _taskAddr) public CurrentTask(_taskAddr, TaskState.VERIFY_TASK) {
        require(tasks[_taskAddr].requester == msg.sender, "Sender is not requester of the task");
        Task storage task = tasks[_taskAddr];
        task.state = TaskState.ASSIGNED_TASK;
        emit TaskStateChanged(msg.sender, task.taskAddr, task.state);
    }

    function cancelTask(uint256 _taskAddr) public {
        Task storage task = tasks[_taskAddr];
        require(task.state == TaskState.ASSIGNED_TASK || task.state == TaskState.VERIFY_TASK, "Task is not at correct state");
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

        task.state = TaskState.UNASSIGNED_TASK;
        task.worker = address(0);
        task.requesterMinimumTrustValueForWorker = 0;
        task.requesterProofOfTrust = 0;
        task.workerProofOfTrust = 0;
        task.salary = 0;

        emit TaskStateChanged(msg.sender, task.taskAddr, task.state);
    }

    function calcRepaymentRate(Task memory task) internal pure returns (uint) {
        return (((task.salary + (task.requesterProofOfTrust / 4)) * 100) / (task.salary + task.requesterProofOfTrust));
    }

}