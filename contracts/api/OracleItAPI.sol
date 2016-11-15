contract OracleItI {
    address public callbackAddress;
    uint public defaultGasLimit;
    uint public defaultGasPrice;
    function query(uint timestamp, bytes32 dataSource, string arg1, string arg2, uint gasLimit, uint gasPrice) returns(uint id);
    function getPrice(bytes32 dataSource) returns(uint price);
}


contract OracleItAddrResolverI {
    function getAddress() returns (address _oracleItAddress);
}


contract usingOracleIt {
    OracleItAddrResolverI OIAR;
    
    OracleItI oracleIt;
    modifier oracleItAPI {
        if(address(OIAR)==0) oracleItSetNetwork();
        oracleIt = OracleItI(OIAR.getAddress());
        _
    }

    function oracleItSetNetwork() internal returns(bool){
        if (getCodeSize(0xcbe4a5a11aa010adbcccad468751f158690ae322)>0){
            OIAR = OracleItAddrResolverI(0xcbe4a5a11aa010adbcccad468751f158690ae322);
            return true;
        }
        return false;
    }
    
    function oracleItQuery(string dataSource, string arg1) oracleItAPI internal returns (uint id){
        return oracleItQuery(0, dataSource, arg1, "", 0, 0);
    }

    function oracleItQuery(uint timestamp, string dataSource, string arg1) oracleItAPI internal returns (uint id){
        return oracleItQuery(timestamp, dataSource, arg1, "", 0, 0);
    }

    function oracleItQuery(string dataSource, string arg1, uint gasLimit, uint gasPrice) oracleItAPI internal returns (uint id){
        return oracleItQuery(0, dataSource, arg1, "", gasLimit, gasPrice);
    }

    function oracleItQuery(uint timestamp, string dataSource, string arg1, uint gasLimit, uint gasPrice) oracleItAPI internal returns (uint id){
        return oracleItQuery(timestamp, dataSource, arg1, "", gasLimit, gasPrice);
    }

    function oracleItQuery(string dataSource, string arg1, string arg2) oracleItAPI internal returns (uint id){
        return oracleItQuery(0, dataSource, arg1, arg2, 0, 0);
    }

    function oracleItQuery(uint timestamp, string dataSource, string arg1, string arg2) oracleItAPI internal returns (uint id){
        return oracleItQuery(timestamp, dataSource, arg1, arg2, 0, 0);
    }

    function oracleItQuery(string dataSource, string arg1, string arg2, uint gasLimit, uint gasPrice) oracleItAPI internal returns (uint id){
        return oracleItQuery(0, dataSource, arg1, arg2, gasLimit, gasPrice);
    }

    function oracleItQuery(uint timestamp, string _dataSource, string arg1, string arg2, uint gasLimit, uint gasPrice) oracleItAPI internal returns (uint id){
        if(gasLimit == 0) gasLimit = oracleIt.defaultGasLimit();
        if(gasPrice == 0) gasPrice = oracleIt.defaultGasPrice();
        uint price = oracleIt.getPrice(stringToBytes32(_dataSource));
        if (price > 1 ether) return 0; // unexpectedly high price
        price += gasLimit * gasPrice;
        return oracleIt.query.value(price)(timestamp, stringToBytes32(_dataSource), arg1, arg2, gasLimit, gasPrice);
    }

    function oracleItCallbackAddress() oracleItAPI internal returns (address){
        return oracleIt.callbackAddress();
    }

    function getCodeSize(address _addr) constant internal returns(uint _size) {
        assembly {
            _size := extcodesize(_addr)
        }
    }

    function stringToBytes32(string memory source) returns (bytes32 result) {
        assembly {
            result := mload(add(source, 32))
        }
    }
}

contract OracleItAPI{
}