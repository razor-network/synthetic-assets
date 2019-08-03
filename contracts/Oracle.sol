pragma solidity ^0.5.8;

contract Oracle {
	mapping (bytes32 => uint256) values;

	event Requested(bytes32 id, string url, string selector);
	function request (string memory url, string memory selector) public {
		bytes32 id = stringHash(url,selector);
		emit Requested(id, url, selector);
	}

	event Fulfilled (bytes32 id, uint256 value);
	function fulfil (bytes32 id, uint256 value) public {
		values[id] = value;
		emit Fulfilled(id, value);
	}

	function get (bytes32 id) public view returns (uint256) {
		return values[id];
	}

	function stringHash(string memory a, string memory b) public view returns(bytes32) {
		return(keccak256(abi.encodePacked(a,b)));

	}
}
