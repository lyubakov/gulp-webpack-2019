const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const config = {
    entry: {
        about: "./src/assets/scripts/about.js",
        auth: "./src/assets/scripts/auth.js",
        works: "./src/assets/scripts/works.js",
        blog: "./src/assets/scripts/blog.js"
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