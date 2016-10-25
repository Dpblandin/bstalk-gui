var path = require('path')
var webpack = require('webpack')
var utils = require('./tasks/utils')

var env = utils.getEnvName()
var plugins = []

if(env === 'production') {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
          compress: {warnings: false},
          mangle: false
      })
    )
}

plugins.push(
  new webpack.ExternalsPlugin('commonjs', [
    'electron'
  ])
)


module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './app'),
        filename: 'app.js'
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                loader: 'json'
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.js'
        }
    },
    babel: {
        "presets": ["es2015", "stage-2"],
        "plugins": ["transform-runtime"]
    },
    plugins: plugins,
    node: {
        fs: "empty",
        __dirname: false,
        __filename: false
    }
}