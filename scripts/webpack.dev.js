var path = require("path");
module.exports = {
    entry: [
        path.join(__dirname, "../dapp/index.js")
    ],
    output: {
        path: path.join(__dirname, "../dist"),
        filename: "bundle.js"
    },
    mode: "development",
    devtool: process.env.WEBPACK_DEVTOOL || 'cheap-module-source-map',
    module: {
        rules: [
            {test: /\.js|jsx$/, use: ["babel-loader"], exclude: /node_modules/},
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {
                test: /\.(woff2?|eot|ttf|otf)$/,
                loader: "url-loader"
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/, loader: "url-loader"
            }
        ]
    }
};