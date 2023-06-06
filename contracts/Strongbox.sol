// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Strongbox {

    struct Fund {
        uint actual;
        uint locked;
    }

    mapping (address => Fund) public ownerToFunds;

    function deposit() public payable {
        require(msg.value > 1000000000, "Minimum deposit value is 1 GWEI");
        ownerToFunds[msg.sender].actual += msg.value;  
    }

    function withdraw(uint _amount) public {
        require(ownerToFunds[msg.sender].actual >= _amount, "There is no enough fund for the current account");
        ownerToFunds[msg.sender].actual -= _amount;
        (bool sent,) = msg.sender.call{value: _amount}("");
        require(sent, "Transfer failed");
    }

    function lock(address _owner, uint _amount) internal {
        require(ownerToFunds[_owner].actual >= _amount, "There is no enough actual fund for this owner");
        ownerToFunds[_owner].actual -= _amount;
        ownerToFunds[_owner].locked += _amount;
    }

    function unlock(address _owner, uint _amount) internal {
        require(ownerToFunds[_owner].locked >= _amount, "Amount is bigger than locked funds for this owner");
        ownerToFunds[_owner].actual += _amount;
        ownerToFunds[_owner].locked -= _amount;
    }

    function transfer(address _from, address _to, uint _amount) internal {
        require(ownerToFunds[_from].actual >= _amount, "There is no enough actual funds for the sender");
        ownerToFunds[_from].actual -= _amount;
        ownerToFunds[_to].actual += _amount;
    } 

    function burn(address _owner, uint _amount) internal {
        require(ownerToFunds[_owner].locked >= _amount, "Amount is bigger than locked funds for this owner");
        (bool sent,) = address(0).call{value: _amount}("");
        if(sent) {
            ownerToFunds[_owner].locked -= _amount;
        } else {
            revert("Transfer failed");
        }
    }


}