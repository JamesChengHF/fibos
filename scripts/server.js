const path = require("path");
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const serve = require("koa-static");
const devWare = require("koa-webpack");
//const mongoose = require('mongoose');
const config = require("./webpack.dev.js");
//const router = require("../router/index")

const app = new Koa();
const port = 80;

// this is our MongoDB database
/*const dbRoute =
    'mongodb://fibos:fibos@mongodb-fibos:27017/fibos';*/

// connects our back end code with the database
/*mongoose.connect(dbRoute, {useNewUrlParser: true});

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));*/

app
    .use(bodyParser())
    .use(serve(path.join(__dirname, "../dist")))
   // .use(router.routes())
   // .use(router.allowedMethods())
    .use(
        devWare({
            config,
            dev: {
                publicPath: "/dist/",
                headers: {"Access-Control-Allow-Origin": "*"},
                hot: true,
                noInfo: true,
/*                proxyTable: {
                    '/api': {
                        target: 'http://localhost:9000/',
                        changeOrigin: true,
                        pathRewrite: {
                            '^/api': '/',
                        },
                    },
                },*/
            },
            hot: {
/*                host: {
                    server: "0.0.0.0",
                    client: "127.0.0.1"
                },*/
                port: 8081,
                hot: true,
            }
        })
    )

    .listen(port, () => {
        console.log("Server Started http://localhost:" + port.toString());
    });
