const CreateFileWebpack = require('create-file-webpack');
const npmPackage = require('./package.json');
const path = require('path');

module.exports = {
  entry: './src/analytics-mitigation-sdk.js',
  output: {
    filename: 'selfheal-analytics-mitigation.js',
    umdNamedDefine: true,
    path: path.resolve(__dirname, 'dist'),
    library: {
      amd: 'selfheal-analytics-mitigation',
      commonjs: 'selfheal-analytics-mitigation'
    },
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  plugins: [
    new CreateFileWebpack({
      // path to folder in which the file will be created
      path: './dist',
      // file name
      fileName: 'selfheal-analytics-mitigation.d.ts',
      // content of the file
      content: 'export * from \'./lib/index\';'
    }),
  ],
};
