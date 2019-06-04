const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const config = {
    entry: {
        example: "./src/assets/scripts/example.js",
    },
    output: {
        filename: "[name].bundle.js"
    },
    plugins: [
        new TerserPlugin({
            sourceMap: true
        })
    ]
};

module.exports = config;