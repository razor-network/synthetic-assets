pragma solidity 0.5.10;
// function to liquidate (optional) this
import "./SimpleToken.sol";
import "../../contracts/contracts/Delegator.sol";


contract CDPFactory {
    mapping (bytes32 => address) public contracts;
    mapping (bytes32 => CDP) public cdps;
    uint256 constant COLLATERAL_RATIO = 500;
    uint256 constant MIN_COLLATERAL_RATIO = 200;
    uint256 numCDP = 0;

    struct CDP {
        bytes32 id;
        bytes32 assetId;
        address tokenAddress;
        address owner;
        uint256 collateral;
        uint256 debt;
        uint256 jobId;
    }

    address public oracleAddress;
    Delegator delegator;
    bool initialized = false;

    event DebugUint256(uint256);

    event DebugBytes32(bytes32);

    function init (address _oracleAddress) public {
        require(!initialized);
        initialized = true;
        oracleAddress = _oracleAddress;
        delegator = Delegator(oracleAddress);
    }

    function mint(uint256 jobId) public payable
    {
        uint256 eth = msg.value;
        address sender = msg.sender;
        // (string memory url, string memory selector, string memory name, bool repeat, uint256 result)
        (string memory url, string memory selector, string memory name , , uint256 result) = delegator.getJob(jobId);
        bytes32 id = keccak256(abi.encodePacked(url, selector));
        (, , , , uint256 ethPrice) = delegator.getJob(1);

        // uint256 price = (result)/ethPrice;
        require(ethPrice != 0,"Eth Price cannot be zero");
        require(result != 0,"Asset price cannot be zero");
        uint256 toMint = (eth*ethPrice*100)/(result*COLLATERAL_RATIO);
        // uint256 tokenPerEth = (ethPrice)/(result*COLLATERAL_RATIO);
        if (toMint == 0) revert("toMint is 0");
        // emit Debug(toMint);
        if (contracts[id] == 0x0000000000000000000000000000000000000000) {
            SimpleToken _st = new SimpleToken(string(abi.encodePacked("Razor Synthetic ", name)), name, 18);
            address ad = address(_st);
            contracts[id] = ad;
        }

        SimpleToken st = SimpleToken(contracts[id]);
        bytes32 cdpid = keccak256(abi.encodePacked(msg.sender, id));
        if (cdps[cdpid].id == 0x0000000000000000000000000000000000000000000000000000000000000000) {
            cdps[cdpid] = CDP(cdpid, id, address(st), msg.sender, msg.value, toMint, jobId);
        } else {
            cdps[cdpid].collateral = cdps[cdpid].collateral + msg.value;
            cdps[cdpid].debt = cdps[cdpid].debt + toMint;
        }
        st.mint(sender, toMint);
        numCDP = numCDP + 1;
        emit DebugBytes32(cdpid);

    }

    function draw(uint256 jobId, uint256 amount) public
    {
        if (amount == 0) revert("amount is 0");
        address sender = msg.sender;
        (string memory url, string memory selector, , , uint256 price) = delegator.getJob(jobId);
        bytes32 id = keccak256(abi.encodePacked(url, selector));
        bytes32 cdpid = keccak256(abi.encodePacked(msg.sender, id));
        CDP storage cdp = cdps[cdpid];
        if(cdp.collateral == 0) revert('CDP has 0 collateral');
        (, , , , uint256 ethPrice) = delegator.getJob(1);

        require(ethPrice != 0,"Eth Price cannot be zero");
        require(price != 0,"Asset price cannot be zero");
        //WARNING Overflow protection missing
        cdp.debt = cdp.debt + amount;
        // assert(cdp.debt > 0);
        uint256 collateralRatio  = (cdp.collateral * ethPrice * 100)/(price * cdp.debt);
        if(collateralRatio < MIN_COLLATERAL_RATIO) revert("Collateral ratio below minimum");

        SimpleToken st = SimpleToken(contracts[id]);
        st.mint(sender, amount);
    }

    function increaseCollateral(uint256 jobId) public payable {
        (string memory url, string memory selector, , , uint256 result) = delegator.getJob(jobId);
        require(result > 0, "Result cannot be zero");
        bytes32 id = keccak256(abi.encodePacked(url, selector));
        bytes32 cdpid = keccak256(abi.encodePacked(msg.sender, id));
        CDP storage cdp = cdps[cdpid];
        require(cdp.collateral > 0, "Existing collateral cannot be zero");
        cdp.collateral = cdp.collateral + msg.value;
    }

    function burn(uint256 jobId) public
    {
        address sender = msg.sender;
        (string memory url, string memory selector, , , uint256 result) = delegator.getJob(jobId);
        bytes32 id = keccak256(abi.encodePacked(url, selector));
        bytes32 cdpid = keccak256(abi.encodePacked(msg.sender, id));
        CDP storage cdp = cdps[cdpid];

        SimpleToken st = SimpleToken(contracts[id]);
        st.burnFrom(sender, cdp.debt);
        msg.sender.transfer(cdp.collateral);
        cdp.collateral =  0; //cdp.collateral - toReturn;
        cdp.debt = 0; //cdp.debt - amount;
    }

    function liquidate(bytes32 cdpId) public {

        // address sender = msg.sender;
        CDP storage cdp = cdps[cdpId];
        emit DebugBytes32(cdp.assetId);
        uint256 price = delegator.getResult(cdp.jobId);
        (, , , , uint256 ethPrice) = delegator.getJob(1);

        require(ethPrice != 0,"Eth Price cannot be zero");
        require(price != 0,"Asset price cannot be zero");


        // priceInEth = price/ethPrice
        // debt value = debt *price in eth
        // cr = collateral value / debt value
        //  = collateral value / (debt *price in eth)
        //  = (collateral value / priceInEth*debt)
        //  = (collateral value / (price/ethPrice) *debt)
        // = (collateral value*ethPrice / price *debt)
        uint256 collateralRatio  = (cdp.collateral * ethPrice * 100)/(price * cdp.debt);

        if ((collateralRatio) < MIN_COLLATERAL_RATIO) {
            msg.sender.transfer(cdp.collateral);
            cdp.collateral = 0;
            cdp.debt = 0;
        }
    }
}
