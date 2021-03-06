import { resolve } from 'path';
import { Configuration } from 'webpack';

const AwsSamPlugin = require('aws-sam-webpack-plugin');
const awsSamPlugin = new AwsSamPlugin();

const config: Configuration = {
  // Set the webpack mode
  mode: process.env.NODE_ENV === 'dev' ? 'development' : 'production',

  // Loads the entry object from the AWS::Serverless::Function resources in your
  // SAM config. Setting this to a function will
  entry: () => awsSamPlugin.entry(),

  // Write the output to the .aws-sam/build folder
  output: {
    filename: (chunkData) => awsSamPlugin.filename(chunkData),
    libraryTarget: 'commonjs2',
    path: resolve('.'),
  },

  // Create source maps
  devtool: 'source-map',

  // Target node
  target: 'node',

  // AWS recommends always including the aws-sdk in your Lambda package but excluding can significantly reduce
  // the size of your deployment package. If you want to always include it then comment out this line. It has
  // been included conditionally because the node10.x docker image used by SAM local doesn't include it.
  externals: process.env.NODE_ENV === 'development' ? [] : ['aws-sdk'],

  // Add the TypeScript loader
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }],
  },

  // Resolve .ts and .js extensions
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      '@utils': resolve('src/utils'),
      '@handlers': resolve('src/handlers'),
    },
  },

  // Add the AWS SAM Webpack plugin
  plugins: [awsSamPlugin],
};

export default config;
