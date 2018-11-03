pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";


contract SmartWallet {
    using SafeMath for uint;

    address public owner = msg.sender;

    uint[20] percent;
    address[20] walletAddress;
    uint totalWallets;

    event Deposited(address indexed _to, uint _percent, uint _amount, uint _total);
    event configureFailure(string msg);
    event configureSuccess(string msg);

    modifier onlyBy(address _account) {
        require(msg.sender == _account);
        _;
    }

    function() payable public {
        require(totalWallets != 0);
        uint amount = msg.value;
        for (uint i = 0; i < totalWallets; i++) {
            emit Deposited(walletAddress[i], percent[i], amount.mul(percent[i]).div(100), amount);
            walletAddress[i].transfer(amount.mul(percent[i]).div(100));
        }
    }

    function getConfiguration() public view onlyBy(owner) returns(uint[20], address[20], uint) {
        return (percent, walletAddress, totalWallets);
    }

    function isContractAddress(address _addr) public view returns (bool isContract) {
        uint32 size;
        /* solhint-disable */
        assembly {
          size := extcodesize(_addr)
        }
        /* solhint-enable */
        return (size > 0);
    }  

    function configureShare(uint _totalWallets, uint[] _percents, address[] _walletAddress) public onlyBy(owner) {
        totalWallets = _totalWallets;

        for (uint j = 0; j < totalWallets; j++) {
            percent[j] = _percents[j];
            walletAddress[j] = _walletAddress[j];
        }

        if (!checkPercentArray(percent)) {
            emit configureFailure("Total Percent Count Isn't 100");
            revert();
        }

        emit configureSuccess("Configuration Successful");
    }

    function checkPercentArray(uint[20] _percent) private view returns(bool) {
        uint checkPercent = 0;
        for (uint i = 0; i < totalWallets; i++) {
            checkPercent += _percent[i];
        }

        if (checkPercent != 100) {
            return false;
        } else {
            return true;
        }
    }
}
