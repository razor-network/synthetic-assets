pragma solidity 0.5.10;
// function to liquidate (optional) this
import "./SimpleToken.sol";
import "../../contracts/contracts/Delegator.sol";


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
        uint256 jobId;
        // uint256 tokenPerEth;
    }

    address public oracleAddress;
    Delegator delegator;
    function init (address _oracleAddress) public {
        oracleAddress = _oracleAddress;
        delegator = Delegator(oracleAddress);
    }
    // function createRequest(string memory url, string memory selector) public {
    // 	Oracle oracle = Oracle(oracleAddress);
    // 	bytes32 id = keccak256(abi.encode(url, selector));
    // 	oracle.request(id, url, selector);
    // }

    event DebugUint256(uint256);

    event DebugBytes32(bytes32);

    function mint(uint256 jobId) public payable
    //only oracle
    {

        uint256 eth = msg.value;
        address sender = msg.sender;
        // (string memory url, string memory selector, bool repeat, uint256 result) = delegator.getJob(jobId);
        (string memory url, string memory selector, , uint256 result) = delegator.getJob(jobId);
        bytes32 id = keccak256(abi.encodePacked(url, selector));
        (, , , uint256 ethPrice) = delegator.getJob(1);

        // uint256 price = (result)/ethPrice;
        require(ethPrice != 0,"Eth Price cannot be zero");
        // if aapl = $1000
        //if eth = $100
        //then price = 10 eth / apple
        // so 10 eth gives you 1 aapl
        //if collateral ratio = 500%
        // he should get 1 appl for 50 eth

        // toMint = (2*220/174*5)
        uint256 toMint = (eth*ethPrice)/(result*COLLATERAL_RATIO);
        // uint256 tokenPerEth = (ethPrice)/(result*COLLATERAL_RATIO);
        if (toMint == 0) revert("toMint is 0");
        // emit Debug(toMint);
        if (contracts[id] == 0x0000000000000000000000000000000000000000) {
            SimpleToken _st = new SimpleToken();
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

    function increaseCollateral(uint256 jobId) public payable {
        address sender = msg.sender;
        (string memory url, string memory selector, , uint256 result) = delegator.getJob(jobId);
        bytes32 id = keccak256(abi.encodePacked(url, selector));
        bytes32 cdpid = keccak256(abi.encodePacked(msg.sender, id));
        CDP storage cdp = cdps[cdpid];
        cdp.collateral = cdp.collateral + msg.value;
    }

    function burn(uint256 jobId) public
    {

        address sender = msg.sender;
        (string memory url, string memory selector, , uint256 result) = delegator.getJob(jobId);
        bytes32 id = keccak256(abi.encodePacked(url, selector));
        bytes32 cdpid = keccak256(abi.encodePacked(msg.sender, id));
        CDP storage cdp = cdps[cdpid];
        // assert(cdpid!=)
        //
        (, , , uint256 ethPrice) = delegator.getJob(1);
        //
        // uint256 price = (result)/ethPrice;
        require(ethPrice != 0,"Eth Price cannot be zero");
        //
        // uint256 toMint = (eth*ethPrice)/(result*COLLATERAL_RATIO);
        // //eth = tokens*price*collateralRatio/ethPrice
        // uint256 toReturn = amount/cdp.tokenPerEth;
        // // require(toReturn <= cdp.collateral/COLLATERAL_RATIO);
        // // emit Debug(toReturn);
        // // emit Debug(toMint);
        //
        SimpleToken st = SimpleToken(contracts[id]);
        st.burnFrom(sender, cdp.debt);
        msg.sender.transfer(cdp.collateral);
        cdp.collateral =  0; //cdp.collateral - toReturn;
        cdp.debt = 0; //cdp.debt - amount;
        // if oil price is 100 and eth is 300, mint 3 oil ethprice / oilprice * eth
        // how much eth to returnj? token = ethprice/assetprice * eth
        // eth = token/price
    }

    function liquidate(bytes32 cdpId) public {

        // address sender = msg.sender;
        CDP storage cdp = cdps[cdpId];
        emit DebugBytes32(cdp.assetId);
        uint256 price = delegator.getResult(cdp.jobId);
        if (price == 0) {
            revert("price cannot be 0");
        }
        uint256 amount = cdp.debt;
        uint256 toReturn = amount/price;
        emit DebugUint256(amount);
        emit DebugUint256(price);
        emit DebugUint256(toReturn);
        // address owner = cdp.owner;
        // SimpleToken st = SimpleToken(contracts[cdp.assetId]);
        if ((toReturn/cdp.collateral) < COLLATERAL_RATIO) {
            msg.sender.transfer(cdp.collateral);
            cdp.collateral = 0;
    // st.burnFrom(owner, cdp.debt);
        }
    // emit Debug(toReturn);
    // emit Debug(toMint);

    // if oil price is 100 and eth is 300, mint 3 oil ethprice / oilprice * eth
    // how much eth to returnj? token = ethprice/assetprice * eth
    // eth = token/price


    }

}
