const fibos = require('fibos');
const Tracker = require("fibos-tracker");
const http = require("http");

fibos.load("http", {
    "http-server-address": "0.0.0.0:8888",
    "access-control-allow-origin": "*",
    "http-validate-host": false,
    "verbose-http-errors": true
});
fibos.load("chain", {
    "contracts-console": true,
    'delete-all-blocks': true,
    "genesis-json": "start_fibos/genesis.json"
});
fibos.load("net",{
    'p2p-listen-endpoint': "0.0.0.0:9876",
    "p2p-peer-address": ["p2p.testnet.fo:80"]
});
fibos.load("chain_api");
fibos.load("producer");
Tracker.Config.DBconnString = "mysql://root:9fd155xY8o8VuiOe@39.104.157.42/fibos_chain"; //使用Mysql数据存储引擎

Tracker.Config.isFilterNullBlock = false; //存储空块

Tracker.Config.isSyncSystemBlock = true; //存储默认数

fibos.config_dir = "start_fibos/fibos_config_dir/";
fibos.data_dir = "start_fibos/fibos_data_dir/";
fibos.enableJSContract = true;

const tracker = new Tracker();

tracker.use(require("./hook.js"));
tracker.emitter(fibos);

fibos.start();

let httpServer = new http.Server("", 9001, [
    (req) => {
        req.session = {};
    }, {
        '^/ping': (req) => {
            req.response.write("pong");
        },
        '/1.0/app': tracker.app,
        "*": [function(req) {}]
    },
    function(req) {}
]);

httpServer.crossDomain = true;
httpServer.asyncRun();