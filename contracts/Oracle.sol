contract Oracle {
	event Requested(bytes32 id, string url, string selector);
	event Fulfilled (bytes32 id, uint256 value);

	function request (bytes32 id, string url, string selector) public {
		emit Requested(id, url, selector);
	}

	function fulfil (bytes32 id, uint256 value) {
		emit Fulfilled(id, value);
	}

	function get (bytes32 id, uint256 value) {
		emit Fulfilled(id, value);
	}
}
