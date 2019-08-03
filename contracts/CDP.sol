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
	function constructory (address _oracleAddress) public {
		oracleAddress = _oracleAddress;
	}

	// function createRequest(string memory url, string memory selector) public {
	// 	Oracle oracle = Oracle(oracleAddress);

	// 	bytes32 id = keccak256(abi.encode(url, selector));
	// 	oracle.request(id, url, selector);
	// }

	event Debug(uint256);
	function mint(string memory url, string memory selector) public payable
	//only oracle 
	{
		Oracle oracle = Oracle(oracleAddress);
		bytes32 id = keccak256(abi.encodePacked(url, selector));

		uint256 val = msg.value;
		address sender = msg.sender;
		uint256 price = oracle.get(id);
		uint256 toMint = msg.value/price;
		// emit Debug(toMint);
		if (contracts[id] == 0x0000000000000000000000000000000000000000) {
			SimpleToken _st = new SimpleToken();
			address ad = address(_st);
			contracts[id] = ad;
		}
		// SimpleToken st = SimpleToken(contracts[id]);
		// st.addMinter(msg.sender);
		// st.mint(sender, toMint);
		// if oil price is 100 and eth is 300, mint 3 oil ethprice / oilprice * eth


	}

}