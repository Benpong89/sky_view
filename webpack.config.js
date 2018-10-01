module.exports = {
  entry: "./lib/game.js",
  output: {
    path: __dirname,
    filename: "./lib/mmor.js"
  },
  devtool: "source-map"
};

// webpack --watch ./lib/game.js -o ./lib/bundle.js --mode=development;
