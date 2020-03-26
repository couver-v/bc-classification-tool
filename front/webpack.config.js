const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
   entry: './client/main.js',
   output: {
      path: path.join(__dirname, '/bundle'),
      filename: 'index_bundle.js'
   },
   devServer: {
      inline: true,
      port: 8001,
      headers:  { "Access-Control-Allow-Origin": "http://101.6.5.216:18000/", "Access-Control-Allow-Credentials": "true" },
   },
    module: {
        rules: [
            {
                test: /\.js$|jsx/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ["@babel/preset-env"]
                }
            },
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            }
      ],
   },
   plugins:[
      new HtmlWebpackPlugin({
         template: './client/index.html'
      })
   ]
}