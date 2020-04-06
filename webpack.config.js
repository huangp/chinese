const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                loader: require.resolve('ts-loader')
            },
            // output js files will have sourcemaps re-processed
            {
                enforce: "pre",
                test: /\.js$/,
                loader: require.resolve('source-map-loader')
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            }
        ]
    },

    entry: {
        chinese: './index.ts'
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/target'
    },

    // suppress warnings about assets and entrypoint size
    performance: {
        hints: false
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },

    node: {
        __dirname: true
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
            showErrors: true,
            // title: 'React-TS-Webpack App',
            path: path.join(__dirname, 'target/'),
            hash: true
        })
    ]
}