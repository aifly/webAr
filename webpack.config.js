var webpack = require('webpack');

var config = {
    entry: {
        'index': "./js/index.js",
        //vendor: ['react','react-dom','iscroll','jquery']
    },
    output: {
        //publicPath: './static/js',
        path: './assets/js',
        filename: "[name].js",
        chunkFilename: "[name].js"
    },
    devServer: {
        inline: true,
        port: 4013,
        hot: true
    },
    externals: {
        //'react':'React',
        //'react-dom':'ReactDOM',
        //'jquery':"$",
        // 'iscroll':'IScroll'
    },
    plugins: [
        /* new webpack.optimize.CommonsChunkPlugin({
            name:"vendor",  
         }),*/
    ],
    module: {
        loaders: [{
            test: /\.jsx|\.js|\.es6$/,
            exclude: /node_modules/,
            loaders: ['react-hot', 'babel']
        }, {
            test: /\.(css)$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.(eot|svg|ttf|woff|woff2|png)\w*/,
            loader: 'file'
        }, {
            test: /\.(png|jpg)$/,
            loader: 'url-loader?limit=8192'
        }]
    },

}

module.exports = config;