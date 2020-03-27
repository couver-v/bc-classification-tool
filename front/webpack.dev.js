const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        inline: true,
        host: '0.0.0.0',
        port: 18001,
    },
});

