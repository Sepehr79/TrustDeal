# TrustExchange
[![Project CI](https://github.com/Sepehr79/TrustDeal/actions/workflows/cisetup.yml/badge.svg)](https://github.com/Sepehr79/TrustDeal/actions/workflows/cisetup.yml)

TrustExchange is a project that uses smart contracts to facilitate secure and fair exchanges between parties. It allows users to deposit and withdraw funds, create and join tasks. here is state change graph of the specific task:

![state change](./etc/img/stateGraph3.jpg)

transmission between task states is only available for requester and worker of that task.

### Flowcharts

here is how a requester works with specific task: 

![requester](./etc/img/Requester.png)

and for worker:

![worker](./etc/img/Worker.png)

### Usecase

Usecase diagram for our smart contract. this allow others to implement their own client-server model. secure data will save on blockchain and nonsecure data on central server. client application intracts with both server and blockchain.

![usecase](./etc/img/usecase.png)