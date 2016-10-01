/**
 * @author: zimyuan;
 * @last-edit-date: 2016-08-09
 */

var webpack           = require('webpack');
var path              = require('path');
var uglifyJsPlugin    = webpack.optimize.UglifyJsPlugin;

module.exports = {
    devtool: 'cheap-source-map',
    entry: [
        path.resolve(__dirname, 'src/index.js'),
    ],
    output: {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: './index.min.js',
        library: 'ES6Template',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders:[
            { test: /\.js[x]?$/, include: path.resolve(__dirname, 'src'), exclude: /node_modules/, loader: 'babel-loader' }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new uglifyJsPlugin({
            compress: {
            warnings: false
            }
        })
    ]
};