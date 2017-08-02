const fs = require('fs');
const os = require('os');
const path = require('path');
const webpack = require('webpack');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
//const iniReader = require('inireader');

//let subdomain = os.homedir().split('/home/')[1];
subdomain = ''; //subdomain.replace('/');


//const parser = new iniReader.IniReader();
//parser.load('/config.ini');
//const subdomain = parser.param('devEnvVars.subdomain');

const files = fs.readdirSync('./src/scripts/').filter(function (file) {
    return path.extname(file) === '.js';
});

const entries = files.reduce(function (obj, file) {
    const key = path.basename(file, '.js');
    obj[key] = [
        './src/scripts/' + key
    ];
    return obj;
}, {});

const outputScriptsDir = 'dist/scripts/';

// chunkName: 'vendor'
entries.vendor = [
    'jquery',
    'underscore',
    'bootstrap-sass',
    'backbone',
    'moment',
    'react',
    'react-dom'
];

module.exports = {
    devtool: 'eval',
    entry: entries,
    output: {
        filename: outputScriptsDir + '[name].js'
    },
    plugins: [

        new webpack.optimize.CommonsChunkPlugin(
            outputScriptsDir + 'vendor.js'
        ),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),

        // dev only, but not currently in use, needs server configuation
        new BrowserSyncPlugin({
            open: false,
            port: 3000,
            proxy: {
                target: 'http://' + subdomain + '.' + os.hostname()
            }
        })

        // // production only.
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         NODE_ENV: JSON.stringify('production')
        //     }
        // }),
        // new webpack.optimize.DedupePlugin(),
        // new webpack.optimize.UglifyJsPlugin({
        //     sourceMap: false,
        //     mangle: false,
        //     compress: {
        //         warnings: false
        //     }
        // }),
    ],
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel-loader',
            include: path.join(__dirname, 'src'),
            query: {
                presets: ['react', 'es2015']
            }
        }]
    }
};
