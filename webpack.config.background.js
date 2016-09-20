var path = require('path')
var webpack = require('webpack')

module.exports = {
    entry: './src/background.js',
    output: {
        path: path.resolve(__dirname, './app'),
        filename: 'background.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            }
        ]
    },
    babel: {
        "presets": ["es2015"],
        "plugins": ["transform-runtime"]
    },
    node: {
        __dirname: false,
        __filename: false,
        process: false
    },
    plugins: [
        new webpack.ExternalsPlugin('commonjs', [
            'electron'
        ])
    ],
    target: 'node'
}