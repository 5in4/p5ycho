module.exports = {
  entry: {
    perlin: './perlin/sketch.js',
    gaussian: './gaussian/sketch.js'
  },

  output: {
    path: __dirname + '/dist',
    filename: '[name].bundle.js'
  },

  module: {
    loaders: [{ test: /\.js$/, exclude: /node_modules/, loaders: ['./hot'] }]
  }
};
