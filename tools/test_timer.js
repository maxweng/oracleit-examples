module.exports = function (callback) {
    var accounts = web3.eth.accounts;
    
    var transInt = function(value){return +value};
    var transUtf8 = function(value){return web3.toUtf8(value)};
    var transString = function(value){return "" + value};
    var transEther = function(value){return +web3.fromWei(value, "ether")};
    var transBool = function(value){return !!value};

    var timer = Timer.deployed();

    function showBalances(cb) {
        if(typeof(cb) === "undefined") cb = function(){};
        var timer_balance = web3.fromWei(+web3.eth.getBalance(timer.address), "ether")
        console.log("Timer Balance: ", timer_balance);
        cb(timer_balance);
    }
    
    function getVariable(variableName, cb) {
        timer[variableName].call().then(function (value) {
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
            ["time", transInt],
            ["times", transInt],
            ["interval", transInt],
            ["running", transBool],
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
            console.log("Timer info: ", info);
            cb(info);
        });
    }

    showBalances();

    function testStartTimer(cb) {
        timer.startTimer({ from: accounts[0], value: web3.toWei(50, "ether") }).then(function (transactionId) {
            console.log("Transaction ID: ", "" + transactionId);
            cb();
        }).catch(function(err){
            console.log(err);
            process.exit();
        });
    }
    
    getInfo(function(){
        testStartTimer(function(){
            showBalances();
            getInfo(function(){
                process.exit();
            });
        });
    });

}