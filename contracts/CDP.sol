// functions
// deposit with eth here
// fetch price from oracle oracle.sol
// mint appropriate erc 20 token erc20 factory.sol
// give token to user this
pragma solidity ^0.5.8;
// function to burn token to return deposit this
// function to liquidate (optional) this
import "./SimpleToken.sol";
import "./Oracle.sol";
contract CDP {
	mapping (bytes32 => address) public contracts;

	address public oracleAddress;
	constructor (address _oracleAddress) public {
		oracleAddress = _oracleAddress;
	}

	function createRequest(string memory url, string memory selector) public {
		Oracle oracle = Oracle(oracleAddress);

		bytes32 id = keccak256(abi.encode(url, selector));
		oracle.request(id, url, selector);
	}

	function mint(string memory url, string memory selector) public payable
	//only oracle 
	{
		Oracle oracle = Oracle(oracleAddress);
		bytes32 id = keccak256(abi.encode(url, selector));

		SimpleToken st = new SimpleToken();
		uint256 val = msg.value;
		address sender = msg.sender;
		// uint256 price = Oracle.get(id);

	}

}