contract Oracle {

	event Requested(string url, string selector);
	function request(bytes32 id, string url, string selector) public {
		// bytes32 id = keccak256(url,selector);
		emit Requested(id, url, selector);
	}

	event Fulfilled(bytes32 id, uint256 value);
	function fulfil(id , value) {
		emit Fulfilled(id, value);
	}

}