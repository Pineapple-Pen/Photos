const path = require('path');
const webpack = require('webpack');

// See: https://stackoverflow.com/questions/37788142/webpack-for-back-end

const SRC_DIR = path.join(__dirname, '/client/src');
const DIST_DIR = path.join(__dirname, '/client/dist');

const common = {
  context: SRC_DIR,
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};

const client = {
  entry: './client.js',
  output: {
    path: DIST_DIR,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'env']
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
    ],
  },
};

const server = {
  entry: './server.js',
  target: 'node',
  output: {
    path: DIST_DIR,
    filename: 'bundle-server.js',
    libraryTarget: 'commonjs-module'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'env']
        }
      },
      {
        test: /\.css$/,
        use: [
          'css-loader'
        ]
      },
    ],
  },
};

module.exports = [
  Object.assign({}, common, client),
  Object.assign({}, common, server)
];


// OLD WEBPACK CONFIG PRIOR TO SERVER SIDE RENDERING (WORKED FINE)
// module.exports = {
//   entry: './client/src/index.jsx',
//   output: {
//     filename: 'bundle.js',
//     path: DIST_DIR,
//   },
//   module: {
//     loaders: [
//       {
//         test: /\.jsx?/,
//         include: SRC_DIR,
//         loader: 'babel-loader',
//         query: {
//           presets: ['react', 'es2015', 'stage-0'],
//         },
//       },
//       {
//         test: /\.css$/,
//         use: [
//           'style-loader',
//           'css-loader'
//         ]
//       },
//     ],
//   },
//   resolve: {
//     extensions: ['.js', '.jsx'],
//   },
// };

