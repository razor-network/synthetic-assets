pragma solidity ^0.5.8;
contract Oracle {

	mapping (bytes32 => uint256) values;

	event Requested(bytes32 id, string url, string selector);
	function request (bytes32 id, string memory url, string memory selector) public {
		emit Requested(id, url, selector);
	}

	event Fulfilled (bytes32 id, uint256 value);
	function fulfill (bytes32 id, uint256 value) public {
		values[id] = value;
		emit Fulfilled(id, value);
	}

	function get (bytes32 id) public view returns (uint256) {
		return values[id];
	}
}
