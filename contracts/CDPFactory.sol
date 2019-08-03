pragma solidity ^0.5.8;
// function to liquidate (optional) this	
import "./SimpleToken.sol";
import "./Oracle.sol";
contract CDPFactory {
	mapping (bytes32 => address) public contracts;
	// cdpId = sha3(owner,assetid)
	mapping (bytes32 => CDP) public cdps;
	uint256 constant COLLATERAL_RATIO = 1;
	uint256 numCDP = 0;
	struct CDP {
		bytes32 id;
		bytes32 assetId;
		address tokenAddress;
		address owner;
		uint256 collateral;
		uint256 debt;
	}

	address public oracleAddress;
	function constructory (address _oracleAddress) public {
		oracleAddress = _oracleAddress;
	}

	// function createRequest(string memory url, string memory selector) public {
	// 	Oracle oracle = Oracle(oracleAddress);

	// 	bytes32 id = keccak256(abi.encode(url, selector));
	// 	oracle.request(id, url, selector);
	// }

	event DebugUint256(uint256);
	event DebugBytes32(bytes32);
	function mint(string memory url, string memory selector) public payable
	//only oracle
	{
		Oracle oracle = Oracle(oracleAddress);
		bytes32 id = keccak256(abi.encodePacked(url, selector));

		uint256 val = msg.value;
		address sender = msg.sender;
		uint256 price = oracle.read(id);
		// price = assetprice/ethprice e.g. 2 barrol oil per eth
		// price = asset/usd/eth/usd 1e18
		// token = eth * price
		// eth = token/price
		uint256 toMint = msg.value*price;
		// emit Debug(toMint);
		if (contracts[id] == 0x0000000000000000000000000000000000000000) {
			SimpleToken _st = new SimpleToken();
			address ad = address(_st);
			contracts[id] = ad;
		}

		SimpleToken st = SimpleToken(contracts[id]);
		bytes32 cdpid = keccak256(abi.encodePacked(msg.sender, id));
		if(cdps[cdpid].id==0x0000000000000000000000000000000000000000000000000000000000000000) {
			cdps[cdpid] = CDP(cdpid, id, address(st), msg.sender, val, toMint);
		}
		else
		{
			cdps[cdpid].collateral = cdps[cdpid].collateral + msg.value;
			cdps[cdpid].debt = cdps[cdpid].debt  + toMint;
		}
		// st.addMinter(msg.sender);
		// require()
		st.mint(sender, toMint);
		numCDP = numCDP + 1;
		emit DebugBytes32(cdpid);
		// if oil price is 100 and eth is 300, mint 3 oil ethprice / oilprice * eth


	}

		function burn(bytes32 id, uint256 amount) public 	
		{
		bytes32 cdpid = keccak256(abi.encodePacked(msg.sender, id));
		CDP storage cdp = cdps[cdpid];
		Oracle oracle = Oracle(oracleAddress);

		address sender = msg.sender;
		uint256 price = oracle.read(id);
		if(price==0) {
			revert("price cannot be 0");
		}
		uint256 toReturn = amount/price;
		require(toReturn <= cdp.collateral/COLLATERAL_RATIO);
		// emit Debug(toReturn);
		// emit Debug(toMint);

		SimpleToken st = SimpleToken(contracts[id]);
		cdp.collateral = cdp.collateral - toReturn;
		cdp.debt = cdp.debt - amount;
		st.burnFrom(sender, amount);
		msg.sender.transfer(toReturn);
		// if oil price is 100 and eth is 300, mint 3 oil ethprice / oilprice * eth
		// how much eth to returnj? token = ethprice/assetprice * eth
		// eth = token/price
	}

		function liquidate(bytes32 cdpId) public 	
		{
		Oracle oracle = Oracle(oracleAddress);

		// address sender = msg.sender;
		CDP storage cdp = cdps[cdpId];
		emit DebugBytes32(cdp.assetId);
		uint256 price = oracle.read(cdp.assetId);
		if(price==0) {
			revert("price cannot be 0");
		}
		uint256 amount = cdp.debt;
		uint256 toReturn = amount/price;
		emit DebugUint256(amount);
		emit DebugUint256(price);
		emit DebugUint256(toReturn);
		// address owner = cdp.owner;
		// SimpleToken st = SimpleToken(contracts[cdp.assetId]);
		if((toReturn/cdp.collateral)<COLLATERAL_RATIO) {
			cdp.collateral = 0;
			msg.sender.transfer(cdp.collateral);
			// st.burnFrom(owner, cdp.debt);
		}
		// emit Debug(toReturn);
		// emit Debug(toMint);

		// if oil price is 100 and eth is 300, mint 3 oil ethprice / oilprice * eth
		// how much eth to returnj? token = ethprice/assetprice * eth
		// eth = token/price


	}

}
