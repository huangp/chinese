const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

const webpack = require('webpack')

module.exports = (env) => {
    const output = (env && env.outputPath) || path.join(__dirname, "/target")

    console.info("env:", JSON.stringify(env))

    const backendUrl = env.BACKEND === 'localhost' ? 'http://localhost:8080' : ''

    console.info(`backend url: ${backendUrl}`)
//
    // const output = env.output || path.join(__dirname, '/target')
    //
    // console.info("output:" + output)

    return {
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
            path: output
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
                path: output,
                // path: path.join(__dirname, '../../target/'),
                hash: true
            }),
            new webpack.DefinePlugin({
                BACKEND_URL: JSON.stringify(backendUrl)
            })
        ],

        devServer: {
            historyApiFallback: true,
            port: 8081
        }
    }
}