require('dotenv').config(); // Load .env

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dayjs = require('dayjs');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// ✅ Generate a consistent build version for both app & meta.json
const buildVersion = Date.now().toString();

// ✅ Plugin to generate meta.json
class GenerateMetaPlugin {
  constructor(version) {
    this.version = version;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('GenerateMetaPlugin', (compilation, callback) => {
      const meta = {
        version: this.version,
        builtAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      };
      const json = JSON.stringify(meta, null, 2);

      compilation.assets['meta.json'] = {
        source: () => json,
        size: () => json.length,
      };

      callback();
    });
  }
}

const plugins = [
  new HtmlWebpackPlugin({
    title: 'Webpack App',
    filename: 'index.html',
    template: 'src/template.html',
  }),
  new GenerateMetaPlugin(buildVersion),
  new webpack.DefinePlugin({
    'process.env.REACT_APP_VERSION': JSON.stringify(buildVersion),
  }),
];

// ✅ Only run Bundle Analyzer when explicitly enabled
if (process.env.ANALYZE === 'true') {
  plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static', // No server
      openAnalyzer: false,    // Don’t auto-open
      reportFilename: 'bundle-report.html',
    })
  );
}

module.exports = {
  mode: 'development',
  entry: {
    bundle: path.resolve(__dirname, 'src/index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
    assetModuleFilename: '[name][ext]',
  },
  devtool: 'source-map',
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins,
};
