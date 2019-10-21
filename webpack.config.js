const path = require('path');

module.exports = {
    mode: "production",
    entry: {
        "code-sample": "./src/code-sample.ts", 
        "directive-sample": "./src/directive-sample.ts"
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, 'docs'),
    },
    devtool: 'inline-source-map'
};