var path = require('path');
var webpack = require('webpack');

module.exports = function (env) {

	var pack = require('./package.json');
	var ExtractTextPlugin = require('extract-text-webpack-plugin');
	var production = !!(env && env.production === 'true');
	var babelSettings = {
		extends: path.join(__dirname, '/.babelrc')
	};

	var config = {
		entry: './src/ar.js',
		output: {
			path: path.join(__dirname, 'dist'),
			publicPath: '/dist/',
			filename: 'arwebapp.js'
		},
		devtool: 'inline-source-map',
		module: {
			rules: [
				{
					test: /\.js$/,
					loader: 'babel-loader?' + JSON.stringify(babelSettings)
				},
				{
					test: /\.(svg|png|jpg|gif)$/,
					loader: 'url-loader?limit=25000'
				},
				{
					test: /\.(less|css)$/,
					loader: ExtractTextPlugin.extract('css-loader!less-loader')
				}
			]
		},
		resolve: {
			extensions: ['.js'],
			modules: ['./src', 'node_modules'],
			alias: {
				'jet-views': path.resolve(__dirname, 'src/views'),
				'jet-locales': path.resolve(__dirname, 'src/locales')
			}
		},
		plugins: [
			new ExtractTextPlugin('./arwebapp.css'),
			new webpack.DefinePlugin({
				VERSION: `"${pack.version}"`,
				APPNAME: `"${pack.name}"`,
				PRODUCTION: production
			})
		],
		devServer: {
		    proxy: {
				'/ar': {
					'target': {
						'host': 'localhost',
						'protocol': 'http:',
						'port': 8686
					},
					ignorePath: false,
					changeOrigin: true,
					secure: false
				}
			}
		}
	};

	if (production) {
		config.plugins.push(
			new webpack.optimize.UglifyJsPlugin({
				test: /\.js$/
			})
		);
	}

	return config;
};