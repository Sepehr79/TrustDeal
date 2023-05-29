// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./Strongbox.sol";

contract TrustExchange is Strongbox {

    event TaskStateChanged(address indexed sender, bytes32 indexed taskAddr, TaskState newState);

    enum TaskState {
        CREATED_BY_REQUESTER,
        ACCEPTED_BY_WORKER,
        DONE_BY_WORKER,
        FINISH_BY_REQUESTER,
        CANCELED,
        REJECTED,
        UNFINISHED   
    }

    struct Task {
        bytes32 taskAddr;
        TaskState state;

        address requester;
        uint salary;
        uint requesterProofOfTrust;
        uint requesterMinimumTrustValueForWorker;

        address worker;
        uint workerProofOfTrust;       
    }

    modifier CurrentTask(bytes32 taskAddr, TaskState state) {
        require(tasks[taskAddr].state == state, "Task is not at the correct state for this process");
        _;
    }

    mapping (bytes32 => Task) public tasks;

    function createTask(
        uint _salary,
        uint _requesterProofOfTrust,
        uint _requesterMinimumTrustValueForWorker
        ) public {
            lock(msg.sender, _salary + _requesterProofOfTrust);

            Task memory task;
            task.state = TaskState.CREATED_BY_REQUESTER;
            task.requester = msg.sender;
            task.salary = _salary;
            task.requesterProofOfTrust = _requesterProofOfTrust;
            task.requesterMinimumTrustValueForWorker = _requesterMinimumTrustValueForWorker;
            task.taskAddr = keccak256(abi.encodePacked(_salary, _requesterProofOfTrust, _requesterMinimumTrustValueForWorker, block.timestamp));

            tasks[task.taskAddr] = task;
            emit TaskStateChanged(msg.sender, task.taskAddr, task.state);
    }

    function acceptTask(bytes32 _taskAddr, uint _workerProofOfTrust) public CurrentTask(_taskAddr, TaskState.CREATED_BY_REQUESTER) {
        require(tasks[_taskAddr].requester != address(0x0));
        require(tasks[_taskAddr].requesterMinimumTrustValueForWorker <= _workerProofOfTrust);
        lock(msg.sender, _workerProofOfTrust);

        Task storage task = tasks[_taskAddr];
        task.state = TaskState.ACCEPTED_BY_WORKER;
        task.worker = msg.sender;
        task.workerProofOfTrust = _workerProofOfTrust;
        emit TaskStateChanged(msg.sender, task.taskAddr, task.state);
    }

    function doneTask(bytes32 _taskAddr) public {
        require(tasks[_taskAddr].worker == msg.sender, "Sender is not worker of the task");
        require(tasks[_taskAddr].state == TaskState.ACCEPTED_BY_WORKER || tasks[_taskAddr].state == TaskState.REJECTED, "Task is not at the correct state");
        tasks[_taskAddr].state = TaskState.DONE_BY_WORKER;
        emit TaskStateChanged(msg.sender, _taskAddr, tasks[_taskAddr].state);
    }

    function finishTask(bytes32 _taskAddr) public CurrentTask(_taskAddr, TaskState.DONE_BY_WORKER) {
        require(tasks[_taskAddr].requester == msg.sender, "Sender is not requester of the task");

        Task storage task = tasks[_taskAddr];
        unlock(task.requester, task.salary + task.requesterProofOfTrust);
        unlock(task.worker, task.workerProofOfTrust);
        transfer(task.requester, task.worker, task.salary);
        task.state = TaskState.FINISH_BY_REQUESTER;
        emit TaskStateChanged(msg.sender, task.taskAddr, task.state);
    }

    function cancelTask(bytes32 _taskAddr) public {
        Task storage task = tasks[_taskAddr];
        if (task.state == TaskState.CREATED_BY_REQUESTER) {
            require(msg.sender == task.requester, "Task doesnt exists with the requested address");    
        } else if (task.state == TaskState.ACCEPTED_BY_WORKER) {
            require(msg.sender == task.requester || msg.sender == task.worker, "Sender doesnt have premission to cancel this task");
        } else if (task.state == TaskState.DONE_BY_WORKER) {
            require(msg.sender == task.worker, "Sender doesnt have premission to cancel this task");
        }
        
        if (task.state != TaskState.FINISH_BY_REQUESTER && task.state != TaskState.CANCELED) {
            _cancelTask(task);
            emit TaskStateChanged(msg.sender, task.taskAddr, task.state);
        }
    }

    function _cancelTask(Task storage _task) private {
        unlock(_task.requester, _task.salary + _task.requesterProofOfTrust);
        unlock(_task.worker, _task.workerProofOfTrust);
        _task.state = TaskState.CANCELED;
    }

    function rejectTask(bytes32 _taskAddr) public CurrentTask(_taskAddr, TaskState.DONE_BY_WORKER) {
        require(tasks[_taskAddr].requester == msg.sender, "Sender is not requester of the task");
        Task storage task = tasks[_taskAddr];
        task.state = TaskState.REJECTED;
        emit TaskStateChanged(msg.sender, task.taskAddr, task.state);
    }
}