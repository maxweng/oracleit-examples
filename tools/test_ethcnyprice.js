module.exports = function (callback) {
    var accounts = web3.eth.accounts;
    
    var transInt = function(value){return +value};
    var transUtf8 = function(value){return web3.toUtf8(value)};
    var transString = function(value){return "" + value};
    var transEther = function(value){return +web3.fromWei(value, "ether")};
    var transBool = function(value){return !!value};

    var ethCnyPrice = EthCnyPrice.deployed();

    function showBalances(cb) {
        if(typeof(cb) === "undefined") cb = function(){};
        var ethCnyPriceBalance = web3.fromWei(+web3.eth.getBalance(ethCnyPrice.address), "ether")
        console.log("EthCnyPrice Balance: ", ethCnyPriceBalance);
        cb(ethCnyPriceBalance);
    }
    
    function getVariable(variableName, cb) {
        ethCnyPrice[variableName].call().then(function (value) {
            cb(value);
        }).catch(function(err){
            console.log(err);
            process.exit();
        });
    }
    
    function getInfo(cb) {
        if(typeof(cb) === "undefined") cb = function(){};
        var info = {};
        var variables = [
            ["timestamp", transInt],
            ["price", transInt],
            ["latestId", transInt],
        ];
        var work = function(i, work_cb){
            if(i >= variables.length){
                return work_cb();
            }
            var veriableName = variables[i][0];
            var transFunc = variables[i][1];
            getVariable(veriableName, function(value){
                info[veriableName] = transFunc(value);
                i++;
                work(i, work_cb);
            });
        }
        work(0, function(){
            console.log("EthCnyPrice info: ", info);
            cb(info);
        });
    }

    showBalances();

    function testQueryPrice(cb) {
        ethCnyPrice.queryPrice({ from: accounts[0], value: web3.toWei(0.1, "ether"), gas: 1000000, gasPrice: 20000000000 }).then(function (transactionId) {
            console.log("Transaction ID: ", "" + transactionId);
            cb();
        }).catch(function(err){
            console.log(err);
            process.exit();
        });
    }
    
    getInfo(function(){
        testQueryPrice(function(){
            showBalances();
            getInfo(function(){
                process.exit();
            });
        });
    });

}